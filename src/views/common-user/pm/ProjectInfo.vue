<template>
  <div class="contain">
    <div class="tabel-header">
      <el-select v-model="searchCondition" placeholder="请选择项目类别">
        <el-option
          v-for="item in category"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="search()">筛选</el-button>
    </div>
    <div class="table-main">
      <el-table
        :data="ProjectInfo"
        border
        stripe
        max-height="550"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="项目类别">
                <span>{{ props.row.project_category.id+"-"+props.row.project_category.name }}</span>
              </el-form-item>
              <el-form-item label="项目简介">
                <span>{{ props.row.project_intro }}</span>
              </el-form-item>
              <el-form-item label="指导老师">

                <br>
                <el-card v-if="props.row.project_teacher !== ''" shadow="always" class="wrap" style="width: 300px;margin-left: 35px;">
                  <span>{{ "学号："+props.row.project_teacher.id }} </span><br>
                  <span>{{ " 姓名："+props.row.project_teacher.name }} </span> <br>
                  <span>{{ " 邮箱："+props.row.project_teacher.email }} </span> <br>
                  <span>{{ " 手机号："+props.row.project_teacher.phone }} </span> <br>
                  <span>{{ " 专业："+props.row.project_teacher.major }} </span> <br>
                </el-card>
              </el-form-item>
              <el-form-item label="成员">
                <div class="wrap">
                  <span
                    v-for="item in props.row.project_member"
                    :key="item.id"
                  >
                    <br>
                    <el-card shadow="always" style="margin-right: 10px; width: 300px;">
                      <span>{{ "学号："+item.id }} </span><br>
                      <span>{{ " 姓名："+item.name }} </span> <br>
                      <span>{{ " 邮箱："+item.email }} </span> <br>
                      <span>{{ " 手机号："+item.phone }} </span> <br>
                      <span>{{ " 专业："+item.major }} </span> <br>
                    </el-card>
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="评语">
                <span
                  v-for="(arr,index) in props.row.project_review"
                  :key="index"
                >
                  <br>
                  <span> <span style="font-weight: bold;">{{ "专家 "+index+": " }}</span>{{ arr }}</span></span><br>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in columns"
          :key="col.id"
          :prop="col.id"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="success" size="small" :disabled="scope.row.project_status === '申报中'?false:true" @click="file(scope.row)">附件</el-button>
            <el-button type="primary" size="small" :disabled="scope.row.project_status === '申报中'?false:true" @click="edit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" :disabled="scope.row.project_status === '申报中'?false:true" @click="deleteProject(scope.$index,scope.row.project_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total"
        :page-size="10"
        @current-change="handle"
      />
    </div>
    <!-- 展示附件窗口 -->
    <el-dialog
      title="附件操作"
      :visible.sync="dialogVisible"
      width="20%"
      :close-on-click-modal="false"
    >
      <div style="display: inline;">
        <span slot="footer" class="dialog-footer">

          <el-upload
            :headers="header"
            :action="action"
            accept="application/x-zip-compressed"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            multiple
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传附件</el-button>
            <div slot="tip" class="el-upload__tip" style="color: red;font-weight: bold;">只能上传zip文件</div>
          </el-upload>

          <el-button size="small" type="success" style="margin-top: 10px;" @click="downloadFile()">点击下载附件</el-button>
        </span></div>

    </el-dialog>
    <!-- 修改一些简单的信息 -->
    <el-dialog
      title="修改项目"
      :visible.sync="editDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form ref="editData" :model="editData" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="editData.project_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目类别" prop="project_category">
          <el-select v-model="editData.project_category" placeholder="请选择项目类别">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目简介" prop="project_intro">
          <el-input
            v-model="editData.project_intro"
            type="textarea"
            :rows="8"
            placeholder="请输入项目简介"
            prop="introduce"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate()">更新</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
// 导入相关文件

import { getToken } from '@/utils/auth'
import { getProjectCategory, getProjectInfo, getProjectNumber, searchByCondition, deleteProject, updateProject, downloadProjectFile } from '@/api/project'
export default {
  data() {
    return {
      searchCondition: '',
      category: [],
      id: '',
      header: {},
      columns: [
        { id: 'project_id', label: '项目ID', width: 200 },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_identity', label: '身份', width: 100 },
        { id: 'project_status', label: '项目状态', width: 200 }
      ],
      dialogVisible: false,
      ProjectInfo: [],
      total: Number(7),
      projectName: '',
      action: '',
      editData: {
        project_id: '',
        project_name: '', // 项目名称
        project_intro: '', // 项目介绍
        project_category: '' // 项目类别
      },
      rules: {
        project_name: { required: true, message: '项目名称不能够为空', trigger: 'blur' },
        project_category: { required: true, message: '项目类别不能够为空', trigger: 'blur' },
        project_intro: { required: false }

      },
      row: '',
      editDialog: false

    }
  },
  created() {
    this.header = { Authorization: getToken() }
    this.getCategorys()
    getProjectInfo({ pageNum: 0, limit: 10 }).then(res => {
      this.ProjectInfo = res.data
      console.log(this.ProjectInfo)
    })
    // 通知
    const h = this.$createElement
    this.$notify.info({
      title: '友情提示',
      message: h('i', { style: 'color: teal' }, '如果是刚申报的项目且需要上传附件的，请在操作处的附件进行上传，以免错过了申报时间！')
    })
    // 获取项目总数
    getProjectNumber().then(res => {
      this.total = res.data
    })
  },
  methods: {
    submitUpdate() {
      this.$refs['editData'].validate(val => {
        if (val) {
          this.editData.project_id = this.row.project_id
          updateProject(this.editData).then(res => {
            this.$message.success(res.message)
            this.$message.success('请记得及时更新附件，最终评审将根据附件')
            this.editDialog = false
          })
        } else {
          this.$message.error('请按要求填写信息后提交')
        }
      })
    },
    // 修改信息
    edit(val) {
      this.row = val
      this.editData.project_name = val.project_name
      this.editData.project_intro = val.project_intro
      this.editData.project_category = val.project_category.name
      this.editDialog = true
    },
    deleteProject(index, id) {
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject({ id: id }).then(res => {
          this.$message.success(res.message)
          // 删除成功了就删掉表格的内容
          this.ProjectInfo.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getCategorys() {
      getProjectCategory().then(res => {
        this.category = res.data
        this.$message.success(res.message)
      })
    },
    // 筛选
    search() {
      this.handle(1)
    },
    file(val) {
      this.action = 'http://localhost:61000/api/project/upload/' + val.project_id
      this.id = val.project_id
      this.projectName = val.project_name

      this.dialogVisible = true
    },
    uploadSuccess(res) {
      this.$message.success(res.message)
    },
    uploadError(res) {
      this.$message.error(res.message)
    },
    downloadFile() {
      downloadProjectFile(this.id, this.header)
        .then(
          res => {
            const data = res.data
            console.log(res)
            // 判断上传的文件大小是否符合规范！！！
            if (data.size === 0) {
              this.$message.error('你还未上传附件，下载失败。')
              return
            }
            const url = window.URL.createObjectURL(new Blob([data]))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', this.projectName + '-' + '附件.zip')
            document.body.appendChild(a)
            a.click() // 执行下载
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
          }
        )
        .catch(function(error) {
          console.log(error)
        })
    },
    // 下方分页的一个处理
    handle(val) {
      if (this.searchCondition) {
        searchByCondition({ pageNum: val - 1, type: this.searchCondition, limit: '10' }).then(res => {
          this.ProjectInfo = res.data
          this.$message.success(res.message)
        })
      } else {
        getProjectInfo({ pageNum: val - 1, limit: 10 }).then(res => {
          this.ProjectInfo = res.data
        })
      }
    }
  }

}
</script>
<style scoped>
  .contain{
    margin-left: 20px;
    margin-top: 20px;
    margin-right: 20px;
  }
  .table-main{
    margin-top: 10px;
    box-shadow: 0 2px 4px rgba(26, 10, 10, 0.12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .table-bottom{
    margin-top: 10px;

  }
  .wrap{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

  }

</style>
