<template>
  <div>
    <div class="buttonfot">
      <el-input v-model="search" placeholder="请输入标题" prefix-icon="el-icon-search" />
    </div>
    <div class="tableContain">
      <el-table
        :data="tableData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
        border
        stripe
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="id"
          label="通知ID"
          width="200"
        />
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          prop="publicDate"
          label="发布时间"
          width="190"
        />
        <el-table-column
          prop="publicPerson"
          label="发布人"
          width="200"
        />
        <el-table-column
          prop="operator"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="deatail(scope.row)">查看</el-button>
            <el-button size="small">下载</el-button>
            <el-button type="success" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="totalnum"
        :page-size="10"
        @current-change="getData"
      />
    </div>

    <el-dialog title="通知详情" width="60%" :visible.sync="dialogTableVisible">
      <div>
        <p style="font-size: 18px;"><span style="font-weight:bold">申报时间:</span> {{ applyTimestart }}至{{ applyTimeend }}</p>
        <p style="font-size: 18px;"><span style="font-weight:bold">年度: </span>{{ applyYear }}</p>
        <p style="font-size: 18px;"><span style="font-weight:bold">评审时间:</span> {{ reviewTimestart }}至{{ reviewTimeend }}</p>
        <p style="font-size: 18px;margin-bottom: 5px;"><span style="font-weight:bold">项目类别:</span> {{ itemcategory }}</p>
        <hr>
        <p class="content" v-html="content" />
      </div>
    </el-dialog>
    <el-dialog title="编辑" width="60%" :visible.sync="editVisible" :before-close="handleClose">
      <el-form ref="ruleFormEdit" :model="ruleFormEdit" :rules="rules" label-width="100px">
        <el-form-item label="通知ID" prop="id">
          <el-input v-model="ruleFormEdit.id" placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="ruleFormEdit.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="申报时间" prop="applyTime">
          <el-date-picker
            v-model="ruleFormEdit.applyTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="评审时间" prop="reviewTime">
          <el-date-picker
            v-model="ruleFormEdit.reviewTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="年度" prop="applyYear">
          <el-input v-model="ruleFormEdit.applyYear" placeholder="请输入年度" />
        </el-form-item>
        <el-form-item label="项目类别" prop="itemcategory">
          <el-input v-model="ruleFormEdit.itemcategory" placeholder="请输入项目类别" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <div>
            <tinymce
              ref="editor"
              v-model="ruleFormEdit.content"
            />
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="update()">更新</el-button>
    </el-dialog>

  </div></template>

<script>
import tinymce from '@/components/Ty-editor.vue'
import { getList, getcount } from '@/api/table'
export default {
  name: 'Notification',
  components: {
    tinymce
  },
  data() {
    return {
      totalnum: 0,
      search: '',
      tableData: [],
      dialogTableVisible: false,
      editVisible: false,
      applyTimestart: '',
      applyTimeend: '',
      applyYear: '',
      reviewTimestart: '',
      reviewTimeend: '',
      content: '',
      itemcategory: '大创项目',
      // 编辑公告栏的内容
      ruleFormEdit: {
        id: '',
        title: '',
        applyTime: ['2020-08-13 12:30:20', '2020-08-14 14:50:23'],
        reviewTime: Date(),
        applyYear: '',
        itemcategory: '',
        content: '编辑内容'
      },
      // 验证规则
      rules: {
        id:
        [{ required: true, message: '通知ID不能够为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能够为空', trigger: 'blur' }],
        applyTime: [{ required: true, message: '申报时间不能够为空', trigger: 'blur' }],
        reviewTime: [{ required: true, message: '评审时间不能够为空', trigger: 'blur' }],
        applyYear: [{ required: true, message: '项目年度不能够为空', trigger: 'blur' }],
        itemcategory: [{ required: true, message: '项目类别不能够为空', trigger: 'blur' }]

      }

    }
  },
  created() {
    this.getData(0)
    this.getTotal()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getData(val) {
      var params = {
        offist: val,
        limit: 10

      }
      // 获取数据
      getList(params).then(response => {
        this.tableData = response.data.items
      })
    },
    // 获取总的数据数
    getTotal() {
      getcount().then(res => {
        this.totalnum = res.data.count
      })
    },
    deatail(value) {
      this.applyTimestart = value.applyTimestart
      this.applyTimeend = value.applyTimeend
      this.applyYear = value.applyYear
      this.content = value.content
      this.reviewTimestart = value.reviewTimestart
      this.reviewTimeend = value.reviewTimeend
      this.itemcategory = value.itemcategory
      this.dialogTableVisible = true
    },
    edit(value) {
      this.ruleFormEdit.id = value.id
      this.ruleFormEdit.applyTime = [value.applyTimestart, value.applyTimeend]
      console.log(this.ruleFormEdit.applyTime)
      this.ruleFormEdit.title = value.title
      this.ruleFormEdit.reviewTime = [value.reviewTimestart, value.reviewTimeend]
      this.ruleFormEdit.applyYear = value.applyYear
      this.ruleFormEdit.content = value.content
      this.ruleFormEdit.itemcategory = value.itemcategory

      this.editVisible = true
    },
    FiledownLoad(val) {
      console.log('开始下载')
    },

    update() {
      console.log(this.ruleFormEdit.applyTime)
    }
  }
}
</script>

<style>
  .tableContain{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  }
  .pagination{
    margin-top: 20px;
    margin-left: 20px;
  }
  .buttonfot{
    width: 300px;
    margin-top: 20px;
    margin-left: 20px;
  }
  .content{
    margin-top: 10px;
    margin-left: 2px;
  }

</style>
