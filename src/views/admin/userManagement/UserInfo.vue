<template>
  <div>

    <div class="buttonGroup">
      <el-input v-model="search_data" placeholder="请输入id" prefix-icon="el-icon-search" style="width: 30%;" />
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="search()"> 搜索  </el-button>
      <el-button type="success" @click="add()">新增<i class="el-icon-circle-plus el-icon--right" /></el-button>
      <el-button type="info" @click="uploadVisiable=true">批量导入 <i class="el-icon-upload el-icon--right" /></el-button></div>
    <div class="tablec">
      <el-table
        :data="studentInfo"
        max-height="550"
        border
        style="width: 100%;"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="邮箱">
                <span>{{ props.row.user_email }}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span>{{ props.row.user_phone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="编号"
        />
        <el-table-column
          prop="user_name"
          label="姓名"
        />

        <el-table-column
          prop="role.role_name"
          label="角色"
        />

        <el-table-column
          prop="major.major_name"
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
        <el-form-item label="专业" prop="major.name">
          <el-select v-model="row.major.name" placeholder="请选择专业">
            <el-option
              v-for="item in major"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="role.role_name">
          <el-select v-model="row.role.role_name" placeholder="请选择角色">
            <el-option
              v-for="item in role"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_name"
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
        <el-form-item label="专业" prop="major.major_name">
          <el-select v-model="newrow.major.name" placeholder="请选择专业">
            <el-option
              v-for="item in major"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role.role_name">
          <el-select v-model="newrow.role.role_name" placeholder="请选择角色">
            <el-option
              v-for="item in role"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_name"
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
          drag
          accept=".xls,.xlsx"
          :action="action"
          :headers="headers"
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
import { getToken } from '@/utils/auth'
import { getUserInfo, getcount, getAllMajor, searchUser, addUserInfo, updateUserInfo, delUserInfo, getAllRole } from '@/api/userInfo'
export default {
  data() {
    return {
      studentInfo: [],
      total: 0,
      major: [],
      search_data: '',
      role: [], // 角色列表
      editVisiable: false,
      newVisiable: false,
      major_id: '',
      uploadVisiable: false,
      headers: {},
      action: 'http://localhost:61000/api/import/users',
      href: 'http://print.kilig.ink/%E6%89%B9%E9%87%8F%E5%A2%9E%E5%8A%A0%E7%94%A8%E6%88%B7%E6%A8%A1%E6%9D%BF.xlsx', // 模板表
      row: {
        user_id: '',
        user_name: '',
        major: {
          id: '',
          name: ''
        },
        user_password: '',
        user_email: '',
        user_phone: '',
        role: {
          role_id: '',
          role_name: ''
        }

      },
      newrow: {
        user_id: '',
        user_name: '',
        major: {
          major_id: '',
          major_name: ''
        },
        user_password: '',
        user_email: '',
        user_phone: '',
        role: {
          role_id: '',
          role_name: ''
        }

      },
      selectedEditRow: null,
      rules: {
        user_id: [{ required: true, message: '学号不能够为空', trriger: 'blur' }],
        user_name: [{ required: true, message: '用户名不能够为空', trriger: 'blur' }],
        major: {
          name: [{ required: true, message: '专业不能够为空', trriger: 'blur' }]
        },
        user_password: [{ required: true, message: '密码不能够为空', trriger: 'blur' }],
        role: {
          role_name: [{ required: true, message: '角色不能够为空', trriger: 'blur' }]

        }
      }
    }
  },
  created() {
    this.getData(1)
    this.getTotal()
    this.headers = { Authorization: getToken() }
  },
  methods: {
    // 支持模糊查找
    search() {
      if (!this.search_data) return
      searchUser({ user_id: this.search_data, pageNum: 1, limit: 10 }).then(res => {
        console.log(res.data)
        this.studentInfo = res.data.res
        this.total = res.data.res.length
      })
    },
    uploaderror(res) {
      this.$message.error('上传失败,请检查上传的文件是否符合要求的格式')
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
            major_id: this.major.filter(item => this.newrow.major.name === item.name)[0].id,
            user_phone: this.newrow.user_phone,
            user_email: this.newrow.user_email,
            role_id: this.role.filter(res => this.newrow.role.role_name === res.role_name)[0].role_id

          }
          addUserInfo(data).then(res => {
            this.$message.success(res.message)
            this.newrow.user_id = ''
            this.newrow.user_name = ''
            this.newrow.user_password = ''
            this.newrow.user_phone = ''
            this.newrow.user_email = ''
            this.newVisiable = false
            this.newrow.role = []
            this.newrow.major = []
          }).catch(error => {
            this.$message.error(error)
            this.$message.error('后台出错，提交失败')
          })
        } else {
          this.$message.error('提交失败')
        }
      })
    },
    add() {
      this.getMajor()
      this.getRole()
      this.newVisiable = true
    },
    getData(val) {
      if (this.search_data) {
        searchUser({ user_id: this.search_data, pageNum: val, limit: 10 }).then(res => {
          console.log(res.data)
          this.studentInfo = res.data.res
          this.total = res.data.res.length
        })
      } else {
        const params = {
          offist: val,
          limit: 10
        }
        getUserInfo(params).then((res) => {
          this.studentInfo = res.data
          this.$message.success('获取成功')
        }).catch((error) => {
          this.$message.error(error)
        })
      }
    },
    getTotal() {
      getcount().then((res) => {
        this.total = parseInt(res.data.total)
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    edit(value) {
      this.getMajor()// 获取所有专业信息
      this.getRole() // 获取所有角色信息
      this.editVisiable = true
      this.row.user_id = value.user_id
      this.row.user_name = value.user_name
      this.row.user_phone = value.user_phone
      this.row.user_email = value.user_email
      this.row.role = value.role
      this.row.major.id = value.major.major_id
      this.row.major.name = value.major.major_name
      this.selectedEditRow = value
    },
    getMajor() {
      getAllMajor({ pageNum: 1, limit: -1 }).then(res => {
        this.major = res.data
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    getRole() {
      getAllRole().then(res => {
        this.role = res.data
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    // 这里通过获取信息 进行提交
    submit() {
      this.$refs['row'].validate(vali => {
        if (vali) {
          const data = {
            user_id: this.row.user_id,
            user_name: this.row.user_name,
            user_password: this.row.user_password,
            major_id: this.major.filter(item => this.row.major.major_name === item.major_name)[0].major_id,
            user_phone: this.row.user_phone,
            user_email: this.row.user_email,
            role_id: this.role.filter(res => this.row.role.role_name === res.role_name)[0].role_id

          }
          updateUserInfo(data).then(res => {
            this.selectedEditRow.user_name = this.row.user_name
            this.selectedEditRow.user_eamil = this.row.user_email
            this.selectedEditRow.user_phone = this.row.user_phone
            this.selectedEditRow.role = this.row.role
            this.selectedEditRow.major = this.row.major
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
    // 删除用户信息
    deleteStu(index, user_id) {
      this.$confirm('此操作会删除相对应的用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserInfo(user_id).then(res => {
          this.$message.success(res.message)
          this.studentInfo.splice(index, 1)
        })
      }).catch(() => {
        this.$message.info('取消成功')
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
