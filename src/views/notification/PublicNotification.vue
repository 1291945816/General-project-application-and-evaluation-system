<template>
  <div>
    <div class="buttonfot">
      <el-input v-model="search" style="width: 300px;" placeholder="请输入标题" prefix-icon="el-icon-search" />
      <el-button type="primary" style="margin-left: 20px ;" @click="refresh()">刷新</el-button>
      <el-button type="success" style="margin-left: 20px ;" @click="newNotice.Visible=true">新增通知</el-button>
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
          prop="notice_id"
          label="通知ID"
          width="200"
        />
        <el-table-column
          prop="notice_title"
          label="标题"
        />
        <el-table-column
          prop="publish_time"
          label="发布时间"
          width="250"
        />
        <el-table-column
          prop="publish_person"
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
            <el-button size="small" @click="fileHandle(scope.row)">文件</el-button>
            <el-button type="success" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRows(scope.$index,scope.row.notice_id)">删除</el-button>
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

    <!-- 通知详情 -->
    <el-dialog title="通知详情" width="60%" :visible.sync="dialogTableVisible">
      <div>
        <p style="font-size: 18px;"><span style="font-weight:bold">申报时间:</span>  <el-tag style="margin-left: 10px;" effect="plain" type="warning">{{ applytimestart }}</el-tag> 至 <el-tag effect="plain" type="warning">{{ applytimeend }} </el-tag></p>
        <p style="font-size: 18px;"><span style="font-weight:bold">年度: </span> <el-tag style="margin-left: 10px;" type="warning">{{ annual }}</el-tag></p>
        <p style="font-size: 18px;"><span style="font-weight:bold">评审时间:</span> <el-tag style="margin-left: 10px;" effect="plain" type="danger">{{ reviewtimestart }}</el-tag> 至 <el-tag effect="plain" type="danger">{{ reviewtimeend }} </el-tag></p>
        <p style="font-size: 18px;margin-bottom: 5px;"><span style="font-weight:bold">项目类别:</span><el-tag style="margin-left: 10px;" type="success">{{ notice_item_name }}</el-tag></p>
        <hr>
        <p class="content" v-html="notice_content" />
      </div>
    </el-dialog>
    <!-- 通知编辑 -->
    <el-dialog title="编辑" width="60%" :visible.sync="editVisible" fullscreen center :before-close="handleClose">
      <el-form ref="ruleFormEdit" :model="ruleFormEdit" :rules="rules" label-width="100px">
        <el-form-item label="通知ID" prop="id">
          <el-input v-model="ruleFormEdit.id" :disabled="true" />
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
        <el-form-item label="可见" prop="visiablePerson">
          <el-select v-model="ruleFormEdit.visiablePerson" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible= false">取 消</el-button>
        <el-button v-loading="loading" element-loading-spinner="el-icon-loading" type="primary" @click="update()">更新</el-button>
      </span>
    </el-dialog>
    <!-- 文件 -->
    <el-dialog title="文件更新" width="60%" :visible.sync="file.fileVisi" center :before-close="handleClose">
      <div>
        <p style="font-weight: bold;">更新文件/上传文件</p>
        <el-upload
          ref="upload"
          :headers="file.headers"
          drag
          :action="file.action"
          accept="application/x-zip-compressed"
          :limit="file.limit"

          :on-success="onSuccess"
          :on-error="onError"
          :auto-upload="false"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传zip文件,并且同时只能上传一个文件，最大支持500MB</div>
        </el-upload>
        <el-button type="success" style="margin-top: 20px ;" @click="submit()">上传到服务器</el-button>
        <el-button type="danger" style="margin-top: 20px ;">删除服务器原有文件</el-button>
      </div>

    </el-dialog>

    <!--新增通知-->
    <el-dialog title="新增通知" width="60%" :visible.sync="newNotice.Visible" fullscreen center :before-close="handleClose">
      <el-form ref="newNotice" :model="newNotice" :rules="rules" label-width="100px">
        <el-form-item label="通知ID" prop="id">
          <el-input v-model="newNotice.id" placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="newNotice.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="申报时间" prop="applyTime">
          <el-date-picker
            v-model="newNotice.applyTime"
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
            v-model="newNotice.reviewTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="年度" prop="applyYear">
          <el-input v-model="newNotice.applyYear" placeholder="请输入年度" />
        </el-form-item>
        <el-form-item label="项目类别" prop="itemcategory">
          <el-input v-model="newNotice.itemcategory" placeholder="请输入项目类别" />
        </el-form-item>
        <el-form-item label="可见" prop="visiablePerson">
          <el-select v-model="newNotice.visiablePerson" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <div>
            <tinymce
              ref="editor"
              v-model="newNotice.content"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newNotice.Visible= false">取 消</el-button>
        <el-button v-loading="newNotice.addloading" element-loading-spinner="el-icon-loading" type="primary" @click="addNotice()">增加</el-button>
      </span>
    </el-dialog>

  </div></template>

<script>
import { formatDate } from '@/utils/timeHandle'
import tinymce from '@/components/Ty-editor.vue'
import { getNotificationList, getNotificationcount, upNotificationInfo, deleteNotificationInfo, newNotificationInfo } from '@/api/notification'
export default {
  name: 'Notification',
  components: {
    tinymce
  },
  data() {
    return {
      // 文件部分
      file: {
        fileVisi: false,
        id: '',
        action: '',
        limit: 1,
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODAwMzAwOTE2IiwiY3JlYXRlZCI6MTU5NzkwODg4NDk1NSwiZXhwIjoxNTk3OTk1Mjg0fQ.Vs9YRjT4pIJCoozx1I0rukEukFJky1xrBhNMBC4ZVsXaU3sLVKypnIFiSntui0x3hSqaKr_WsBbOBvZUYs82fA'
        }

      },
      // 新增通知部分
      newNotice: {
        Visible: false,
        id: '',
        title: '',
        applyTime: [],
        reviewTime: [],
        applyYear: '',
        itemcategory: '',
        content: '编辑通知正文',
        visiablePerson: '',
        addloading: false

      },

      totalnum: 0,
      search: '',
      tableData: [],
      dialogTableVisible: false,
      editVisible: false,
      applytimestart: '',
      applytimeend: '',
      annual: '',
      reviewtimestart: '',
      reviewtimeend: '',
      notice_content: '',
      notice_item_name: '大创项目',
      editValue: null, // 编辑的行,
      loading: null,
      mulTable: [],
      // 可见条件
      options: [
        {
          value: 'teacher',
          label: '教师'
        },
        {
          value: 'student',
          label: '学生'
        },
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'admin',
          label: '管理员'
        }
      ],
      // 编辑公告栏的内容
      ruleFormEdit: {
        id: '',
        title: '',
        applyTime: [],
        reviewTime: [],
        applyYear: '',
        itemcategory: '',
        content: '编辑内容',
        visiablePerson: ''
      },
      // 验证规则
      rules: {
        id:
        [{ required: true, message: '通知ID不能够为空且不能够含有中文', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能够为空', trigger: 'blur' }],
        applyTime: [{ required: true, message: '申报时间不能够为空', trigger: 'blur' }],
        reviewTime: [{ required: true, message: '评审时间不能够为空', trigger: 'blur' }],
        applyYear: [{ required: true, message: '项目年度不能够为空', trigger: 'blur' }],
        itemcategory: [{ required: true, message: '项目类别不能够为空', trigger: 'blur' }],
        visiablePerson: [{ required: true, message: '可见角色不能够为空', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.getData(1)
    this.getTotal()
  },
  methods: {
    addNotice() {
      this.newNotice.addloading = true
      this.$refs['newNotice'].validate((vald) => {
        if (vald) {
          this.$message.success('校验成功')
          const data = {
            id: this.newNotice.id,
            applyTimestart: this.newNotice.applyTime[0],
            applyTimeend: this.newNotice.applyTime[1],
            title: this.newNotice.title,
            reviewTimestart: this.newNotice.reviewTime[0],
            reviewTimeend: this.newNotice.reviewTime[1],
            applyYear: this.newNotice.applyYear,
            content: this.newNotice.content,
            itemcategory: this.newNotice.itemcategory,
            visiablePerson: this.newNotice.visiablePerson
          }

          // 这里发起增加通知的请求
          newNotificationInfo(data).then(
            res => {
              this.$message.success(res.message)
              // 成功了就清空原内容
              this.newNotice.id = ''
              this.newNotice.title = ''
              this.newNotice.applyTime = []
              this.newNotice.reviewTime = []
              this.newNotice.applyYear = ''
              this.newNotice.itemcategory = ''
              this.newNotice.content = '编辑通知正文'
              this.newNotice.visiablePerson = ''
              this.newNotice.Visible = false
            }
          )
        } else {
          this.$message.error('提交被拒绝了,通知内容不完善')
        }
        this.newNotice.addloading = false
      })
    },
    refresh() {
      this.getData(1)
      this.getTotal()
    },
    // 删除一行
    deleteRows(index, id) {
      console.log(id)
      deleteNotificationInfo(id).then(res => {
        // 先向数据库进行删除
        this.$message.success(res.message)
        this.tableData.splice(index, 1) // 删除一行
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getData(val) {
      var params = {
        pageNum: val,
        limit: 10

      }
      // 获取数据
      getNotificationList(params).then(response => {
        this.tableData = response.data
        for (let i = 0; i < this.tableData.length; ++i) {
          this.tableData[i].publish_time = formatDate(new Date(this.tableData[i].publish_time), 2)
        }
      })
    },
    // 获取总的数据数
    getTotal() {
      getNotificationcount().then(res => {
        this.totalnum = parseInt(res.data.count)
      })
    },
    deatail(value) {
      this.applytimestart = formatDate(new Date(value.applytimestart), 2)
      this.applytimeend = formatDate(new Date(value.applytimeend), 2)
      this.annual = value.annual
      this.notice_content = value.notice_content
      this.reviewtimestart = formatDate(new Date(value.reviewtimestart), 2)
      this.reviewtimeend = formatDate(new Date(value.reviewtimeend), 2)
      this.notice_item_name = value.notice_item_name
      this.dialogTableVisible = true
    },
    edit(value) {
      this.ruleFormEdit.id = value.notice_id
      this.ruleFormEdit.applyTime = [new Date(value.applytimestart), new Date(value.applytimeend)]
      this.ruleFormEdit.title = value.notice_title
      var time = new Date(value.reviewtimeend)
      console.log(time)
      this.ruleFormEdit.reviewTime = [new Date(value.reviewtimestart), new Date(value.reviewtimeend)]
      this.ruleFormEdit.applyYear = value.annual
      this.ruleFormEdit.content = value.notice_content
      this.ruleFormEdit.itemcategory = value.notice_item_name
      this.editValue = value
      this.ruleFormEdit.visiablePerson = value.visible

      this.editVisible = true
    },
    // 当文件上传成功的时候...
    onSuccess(res) {
      this.$alert(res.message, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('上传成功')
        }
      })
    },
    // 文件上传失败的时候
    onError(res) {
      this.$alert('创建失败', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('上传失败')
        }
      })
    },
    // 这里填写上传的地址
    submit() {
      this.file.action = 'http://127.0.0.1:61000/api/notification/uploadTemplateFile/' + this.file.id
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },

    //

    // 用于更新文件
    update() {
      this.loading = true

      this.$refs['ruleFormEdit'].validate((vald) => {
        if (vald) {
          // 更新表单的值 并向数据库发起请求
          upNotificationInfo({
            id: this.ruleFormEdit.id,
            applyTimestart: formatDate(this.ruleFormEdit.applyTime[0], 2),
            applyTimeend: formatDate(this.ruleFormEdit.applyTime[1], 2),
            title: this.ruleFormEdit.title,
            reviewTimestart: formatDate(this.ruleFormEdit.reviewTime[0], 2),
            reviewTimeend: formatDate(this.ruleFormEdit.reviewTime[1], 2),
            applyYear: this.ruleFormEdit.applyYear,
            content: this.ruleFormEdit.content,
            itemcategory: this.ruleFormEdit.itemcategory,
            visiablePerson: this.ruleFormEdit.visiablePerson
          }).then(res => {
            // 应该等数据库的请求返回时再修改
            this.editValue.id = this.ruleFormEdit.id
            this.editValue.applyTimestart = this.ruleFormEdit.applyTime[0]
            this.editValue.applyTimeend = this.ruleFormEdit.applyTime[1]
            this.editValue.title = this.ruleFormEdit.title
            this.editValue.reviewTimestart = this.ruleFormEdit.reviewTime[0]
            this.editValue.reviewTimeend = this.ruleFormEdit.reviewTime[1]
            this.editValue.applyYear = this.ruleFormEdit.applyYear
            this.editValue.content = this.ruleFormEdit.content
            this.editValue.itemcategory = this.ruleFormEdit.itemcategory
            this.editVisible = false
            this.$message.success(res.message)
          })
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('请按要求完善表单信息')
        }
      })
    },
    fileHandle(value) {
      this.file.fileVisi = true
      this.file.id = value.id // 文件ID
      console.log(value.id)
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
    margin-top: 20px;
    margin-left: 20px;
  }
  .content{
    margin-top: 10px;
    margin-left: 2px;
  }

</style>
