<template>
  <div class="contain">
    <div class="head">
      <el-input v-model="search" style="width: 30%;" placeholder="请输入学院编号,支持模糊查找" />
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="SearchInfo(1)">搜索</el-button>
      <el-button type="success" @click="newRow()">新增<i class="el-icon-circle-plus el-icon--right" /></el-button>
      <el-button type="info" @click="moreImport()">批量导入 <i class="el-icon-upload el-icon--right" /></el-button>
    </div>
    <div class="main">
      <el-table
        :data="majorInfo"
        border
        stripe
        max-height="500"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.id"
          :prop="col.id"
          :label="col.label"
        />
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="delete_(scope.$index,scope.row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="foot">
      <el-pagination
        background
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="InitMajorInfo"
      />
    </div>
    <el-dialog
      title="编辑专业信息"
      :visible.sync="visibel.edit"
    >
      <el-form ref="editInfo" :model="editInfo" label-width="100px">
        <el-form-item label="专业编号">
          <el-input v-model="editInfo.id" :disabled="true" />
        </el-form-item>

        <el-form-item label="专业名称" prop="name" :rules="[{required:true,message:'专业名称不能够为空',trigger:'blur'}]">
          <el-input v-model="editInfo.name" />
        </el-form-item>
        <el-form-item label="学院编号" prop="collegeId" :rules="[{required:true,message:'所属学院编号不能够为空',trigger:'blur'}]">
          <el-select v-model="editInfo.collegeId" placeholder="请选择">
            <el-option
              v-for="item in college"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click=" visibel.edit= false">取 消</el-button>
        <el-button type="primary" @click="update()">更新</el-button>
      </span>
    </el-dialog>

    <!-- 新增专业 -->
    <el-dialog
      title="新增专业信息"
      :visible.sync="visibel.new"
    >
      <el-form ref="newInfo" :model="newInfo" label-width="100px">
        <el-form-item label="专业编号" prop="id" :rules="[{required:true,message:'专业编号不能够为空',trigger:'blur'}]">
          <el-input v-model="newInfo.id" />
        </el-form-item>

        <el-form-item label="专业名称" prop="name" :rules="[{required:true,message:'专业名称不能够为空',trigger:'blur'}]">
          <el-input v-model="newInfo.name" />
        </el-form-item>
        <el-form-item label="学院编号" prop="collegeId" :rules="[{required:true,message:'所属学院编号不能够为空',trigger:'blur'}]">
          <el-select v-model="newInfo.collegeId" placeholder="请选择">
            <el-option
              v-for="item in college"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click=" visibel.new= false">取 消</el-button>
        <el-button type="primary" @click="addMajor()">更新</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入专业信息"
      :visible.sync="visibel.import"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        drag
        accept=".xls,.xlsx"
        :action="action"
        :limit="1"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传Excel文件，<a :href="href" style="color: red;font-weight: bold; font-size: 16px;">点击这里下载模板</a></div>
      </el-upload>
    </el-dialog>

  </div>
</template>
<script>
import { getMajorCount, getAllMajors, updateMajorInfo, addMajorInfo, deleteMajorInfo, getMajorInfoByCollege } from '@/api/major'
import { getCollegeInfo } from '@/api/college'
export default {
  data() {
    return {
      action: 'api/major/upload', // 上传的目标地址,
      href: '', // 模板的下载地址
      total: 100,
      search: '',
      newInfo: {
        id: '',
        name: '',
        collegeId: ''
      },
      SelectedRow: null,
      editInfo: {
        id: '',
        name: '',
        collegeId: ''

      },
      college: [],
      visibel: {
        edit: false,
        new: false,
        import: false
      },
      majorInfo: [],
      columns: [
        { id: 'id', label: '专业编号' },
        { id: 'name', label: '专业名称' },
        { id: 'collegeId', label: '所属学院编号' }
      ]

    }
  },
  created() {
    this.InitMajorInfo(1)
    this.InitMajorCount()
  },
  methods: {
    // 删除专业信息
    delete_(index, id) {
      deleteMajorInfo({ id: id }).then(res => {
        this.$message.success(res.message)
        this.majorInfo.splice(index, 1)
      })
    },
    // 搜索 按学院进行搜索
    SearchInfo(val) {
      getMajorInfoByCollege({ id: this.search, pageNum: val, limit: 10 }).then(res => {
        this.majorInfo = res.data
        this.$message.success(res.message)
      })
    },
    getCollege() {
      getCollegeInfo({ pageNum: 1, limit: -1 }).then(res => {
        this.college = res.data
      })
    },

    newRow() {
      // 获取学院信息
      this.getCollege()
      this.visibel.new = true
    },
    // 新增专业信息
    addMajor() {
      this.$refs['newInfo'].validate(val => {
        if (val) {
          addMajorInfo(this.newInfo).then(res => {
            this.$message.success(res.message)
            this.newInfo.id = ''
            this.newInfo.name = ''
            this.newInfo.collegeId = ''
          }
          )
        } else {
          this.$message.error('提交失败，信息不完整')
        }
      })
    },
    // 更新专业信息
    update() {
      this.$refs['editInfo'].validate(val => {
        if (val) {
          updateMajorInfo(this.editInfo).then(res => {
            this.$message.success(res.message)
            this.SelectedRow.name = this.editInfo.name
            this.SelectedRow.collegeId = this.editInfo.collegeId
            this.visibel.edit = false
          })
        } else {
          this.$message.error('提交失败，信息不完整')
        }
      })
    },
    // 打开编辑栏顺便把信息都更新一遍
    edit(row) {
      // 获取学院信息
      getCollegeInfo({ pageNum: 1, limit: -1 }).then(res => {
        this.college = res.data
      })
      this.visibel.edit = true
      this.editInfo.id = row.id
      this.editInfo.name = row.name
      this.editInfo.collegeId = row.collegeId
      this.SelectedRow = row
    },
    moreImport() {
      this.visibel.import = true
    },
    InitMajorInfo(val) {
      if (this.search.replace(/\s*/g, '') === '') {
        getAllMajors({ pageNum: val, limit: 10 }).then(res => {
          this.majorInfo = res.data
          this.$message.success(res.message)
        })
      } else {
        getMajorInfoByCollege({ id: this.search, pageNum: val, limit: 10 }).then(res => {
          this.majorInfo = res.data
          this.$message.success(res.message)
        })
      }
    },
    InitMajorCount() {
      getMajorCount().then(res => {
        this.total = res.data
        this.$message.success(res.message)
      })
    }

  }

}

</script>
<style scoped>
  .contain{
  margin-left: 20px;
  margin-top: 20px;

}
.main{
  margin-top: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(26, 10, 10, 0.12), 0 0 6px rgba(0, 0, 0, .04);
}
.foot{
  margin-top: 20px;

}

</style>
