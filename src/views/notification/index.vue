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
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="deatail(scope.row)">详情</el-button>
            <el-button type="success" size="small" @click="FiledownLoad(scope.row)">模板文件下载</el-button>
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

  </div></template>

<script>
import { getList, getcount } from '@/api/table'
export default {
  name: 'Notification',
  data() {
    return {
      totalnum: 0,
      search: '',
      tableData: [],
      dialogTableVisible: false,
      applyTimestart: '',
      applyTimeend: '',
      applyYear: '',
      reviewTimestart: '',
      reviewTimeend: '',
      content: '',
      itemcategory: '大创项目'

    }
  },
  created() {
    this.getData(1)
    this.getTotal()
  },
  methods: {
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
    FiledownLoad(val) {
      console.log('开始下载')
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
