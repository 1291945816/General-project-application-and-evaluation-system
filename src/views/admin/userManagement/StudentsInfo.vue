<template>
  <div>

    <div class="buttonGroup">
      <el-input placeholder="请输入学号" prefix-icon="el-icon-search" style="width: 30%;" />
      <el-button type="primary" style="margin-left: 10px;" @click="refresh()"> 刷新  <i class="el-icon-refresh el-icon--right" /></el-button>
      <el-button type="success" @click="add()">新增<i class="el-icon-circle-plus el-icon--right" /></el-button>
      <el-button type="info" @click="uploadVisiable=true">批量导入 <i class="el-icon-upload el-icon--right" /></el-button></div>
    <div class="tablec">
      <el-table
        :data="studentInfo"
        height="550"
        border
        style="width: 100%;"
      >
        <el-table-column
          prop="user_id"
          label="学号"
        />
        <el-table-column
          prop="user_name"
          label="姓名"
        />
        <el-table-column
          prop="user_email"
          label="邮箱"
        />
        <el-table-column
          prop="user_phone"
          label="手机号码"
        />
        <el-table-column
          prop="user_major"
          label="专业"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteStu(scope.$index,scope.row.user_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-left: 10px; margin-top: 5px;">
      <el-pagination
        background
        :page-size="10"
        layout="total,prev, pager, next"
        :total="total"
        @current-change="getData"
      />
    </div>
    <el-dialog
      title="编辑"
      :visible.sync="editVisiable"
    >
      <el-form ref="row" :model="row" status-icon :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="user_id">
          <el-input v-model="row.user_id" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model="row.user_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="row.user_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业" prop="user_major">
          <el-select v-model="row.user_major" placeholder="请选择专业">
            <el-option
              v-for="item in major"
              :key="item.major_id"
              :label="item.major_name"
              :value="item.major_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="user_phone">
          <el-input v-model="row.user_phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="row.user_email" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>

    </el-dialog>

    <el-dialog
      title="新增学生"
      :visible.sync="newVisiable"
    >
      <el-form ref="newrow" :model="newrow" status-icon :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="user_id">
          <el-input v-model="newrow.user_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model="newrow.user_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input v-model="newrow.user_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业" prop="user_major">
          <el-select v-model="newrow.user_major" placeholder="请选择专业">
            <el-option
              v-for="item in major"
              :key="item.major_id"
              :label="item.major_name"
              :value="item.major_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="user_phone">
          <el-input v-model="newrow.user_phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="newrow.user_email" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addStudent()">新增</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量导入"
      center
      :visible.sync="uploadVisiable"
    >
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          accept=".xls,.xlsx"
          :action="action"
          :on-success="uploadsuccess"
          :on-error="uploaderror"

          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">必须按照模板文件的格式进行上传表格，<a :href="href" style="color: blueviolet; font: 16px sans-serif;"> 点击这里下载模板</a></div>
        </el-upload>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getStudentInfo, getcount, getAllMajor, addStudentInfo, updateStudenInfo, delStudentInfo } from '@/api/student'
export default {
  data() {
    return {
      studentInfo: [],
      total: 1000,
      major: [],
      editVisiable: false,
      newVisiable: false,
      major_id: '',
      uploadVisiable: false,
      action: '/api/importStudents',
      href: 'http://print.kilig.ink/%E6%89%B9%E9%87%8F%E5%A2%9E%E5%8A%A0%E7%94%A8%E6%88%B7%E6%A8%A1%E6%9D%BF.xlsx',
      row: {
        user_id: '',
        user_name: '',
        user_major: '',
        user_password: '',
        user_email: '',
        user_phone: ''
      },
      newrow: {
        user_id: '',
        user_name: '',
        user_major: '',
        user_password: '',
        user_email: '',
        user_phone: ''

      },
      selectedEditRow: null,
      rules: {
        user_id: [{ required: true, message: '学号不能够为空', trriger: 'blur' }],
        user_name: [{ required: true, message: '用户名不能够为空', trriger: 'blur' }],
        user_major: [{ required: true, message: '专业不能够为空', trriger: 'blur' }],
        user_password: [{ required: true, message: '密码不能够为空', trriger: 'blur' }]

      }
    }
  },
  created() {
    this.getData(1)
    this.getTotal()
  },
  methods: {
    uploaderror(res) {
      this.$message.error('上传失败')
    },
    uploadsuccess() {
      this.$message.success('上传成功')
    },
    // 从这里新增用户信息
    addStudent() {
      this.$refs['newrow'].validate(val => {
        if (val) {
          const data = {
            user_id: this.newrow.user_id,
            user_name: this.newrow.user_name,
            user_password: this.newrow.user_password,
            user_major: this.newrow.user_major,
            user_phone: this.newrow.user_phone,
            user_email: this.newrow.user_email
          }
          addStudentInfo(data).then(res => {
            this.$message.success(res.message)
            this.newrow.user_id = ''
            this.newrow.user_name = ''
            this.newrow.user_password = ''
            this.newrow.user_major = ''
            this.newrow.user_phone = ''
            this.newrow.user_email = ''
            this.newVisiable = false
          }).catch(error => {
            this.$message.error(error)
            this.$message.error('后台出错，提交失败')
          })
        } else {
          this.$message.success('提交失败')
        }
      })
    },
    add() {
      this.getMajor()
      this.newVisiable = true
    },
    getData(val) {
      const params = {
        offist: val,
        limit: 10
      }
      getStudentInfo(params).then((res) => {
        this.studentInfo = res.data.items
        this.$message.success('获取成功')
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    getTotal() {
      getcount().then((res) => {
        this.total = res.data.count
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    edit(value) {
      this.getMajor()
      this.editVisiable = true
      this.row.user_id = value.user_id
      this.row.user_name = value.user_name
      this.row.user_phone = value.user_phone
      this.row.user_email = value.user_email
      this.selectedEditRow = value
    },
    getMajor() {
      getAllMajor().then(res => {
        this.major = res.data.items
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    refresh() {
      this.getData(1)
      this.getTotal()
    },
    // 这里通过获取信息 进行提交
    submit() {
      this.$refs['row'].validate(vali => {
        if (vali) {
          const data = {
            user_id: this.row.user_id,
            user_name: this.row.user_name,
            user_password: this.row.user_password,
            user_major: this.row.user_major,
            user_phone: this.row.user_phone,
            user_email: this.row.user_email
          }
          updateStudenInfo(data).then(res => {
            this.selectedEditRow.user_name = this.row.user_name
            this.selectedEditRow.user_major = this.major.filter(res => this.row.user_major === res.major_id)[0].major_name
            this.selectedEditRow.user_phone = this.row.user_email
            this.selectedEditRow.user_phone = this.row.user_phone
            this.$message.success(res.message)

            this.editVisiable = false
          }).catch(error => {
            this.$message.error(error)
            this.$message.error('后台出错，提交失败')
          })
        } else {
          this.$message.error('提交拒绝了，请按要求填写信息')
        }
      })
    },
    // 删除学生信息
    deleteStu(index, user_id) {
      delStudentInfo(user_id).then(res => {
        this.$message.success(res.message)
        this.studentInfo.splice(index, 1)
      })
    }
  }

}
</script>
<style>

.buttonGroup{
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;

}
.tablec{
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.upload{
  text-align: center;

}
</style>
