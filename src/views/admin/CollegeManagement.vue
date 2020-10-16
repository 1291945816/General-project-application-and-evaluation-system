<template>
  <div class="contain">
    <div class="head">
      <el-input v-model="search" style="width: 30%;" placeholder="请输入学院编号" />
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="SearchInfo()">搜索</el-button>
      <el-button type="success" @click="newRow()">新增<i class="el-icon-circle-plus el-icon--right" /></el-button>
      <el-button type="info" @click="moreImport()">批量导入<i class="el-icon-upload el-icon--right" /></el-button>
    </div>
    <div class="main">
      <el-table :data="collegeInfo" border max-height="550" style="width: 100%;" stripe>
        <el-table-column
          v-for="col in columns"
          :key="col.id"
          :prop="col.id"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="delete_(scope.$index,scope.row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑功能 -->
    <el-dialog title="编辑学院信息" :visible.sync="visible.edit">
      <el-form ref="editInfo" :model="editInfo" label-width="80px">
        <el-form-item label="学院编号">
          <el-input v-model="editInfo.id" :disabled="true" />
        </el-form-item>
        <el-form-item
          label="学院名称"
          prop="name"
          :rules="[{required:true,message:'学院名称不能够为空',trigger:'blur'}]"
        >
          <el-input v-model="editInfo.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即更新</el-button>
          <el-button @click="visible.edit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增功能 -->
    <el-dialog title="新增学院信息" :visible.sync="visible.new">
      <el-form ref="newInfo" :model="newInfo" label-width="80px">
        <el-form-item
          label="学院编号"
          prop="id"
          :rules="[{required:true,message:'学院编号不能够为空',trigger:'blur'}]"
        >
          <el-input v-model="newInfo.id" />
        </el-form-item>
        <el-form-item
          label="学院名称"
          prop="name"
          :rules="[{required:true,message:'学院名称不能够为空',trigger:'blur'}]"
        >
          <el-input v-model="newInfo.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCollege">新增</el-button>
          <el-button @click="visible.new=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 批量导入功能 -->
    <el-dialog title="导入学院信息" :visible.sync="visible.import">
      <el-upload
        drag
        :action="action"
        multiple
        :limit="1"
        :headers="headers"
        accept=".xls,.xlsx"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传Excel文件，<a :href="href" style="color: red;font-weight: bold; font-size: 16px;">点击这里下载模板</a></div>
      </el-upload>
    </el-dialog>

    <div class="foot">
      <el-pagination
        background
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="InitCollegeInfo"
      />
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getCollegeInfo, getCollegecount, updateCollegeInfo, addCollegeInfo, deleteCollegeInfo, SearchCollegeInfo } from '@/api/college'
export default {
  data() {
    return {
      action: 'http://localhost:61000/api/import/colleges', // 文件上传目的地,
      href: 'http://print.kilig.ink/%E6%89%B9%E9%87%8F%E5%A2%9E%E5%8A%A0%E5%AD%A6%E9%99%A2%E6%A8%A1%E6%9D%BF.xlsx', // 模板下载连接
      selectedRow: null, // 编辑行
      headers: {},
      visible: {
        edit: false,
        new: false,
        import: false
      },
      editInfo: {
        id: '',
        name

      },
      newInfo: {
        id: '',
        name: ''
      },
      search: '',
      collegeInfo: [], // 学院信息
      total: 10, // 学院的总数
      columns: [
        { id: 'id', label: '学院编号' },
        { id: 'name', label: '学院名称' }
      ]
    }
  }, created() {
    this.InitCollegeInfo(1) // 初始化
    this.getTotal() // 获取总数
    this.headers = { Authorization: getToken() }
  },
  methods: {
    /**
     * 删除学院信息
     * */
    delete_(index, val_id) {
      deleteCollegeInfo({ id: val_id }).then(res => {
        this.$message.success = res.message
        this.collegeInfo.splice(index, 1)
      })
    },
    SearchInfo() {
      if (!this.search) return
      SearchCollegeInfo({ id: this.search, pageNum: 1, limit: 10 }).then(res => {
        this.collegeInfo = res.data
        this.total = res.data.length // 设置长度
      })
    },

    // 新增学院信息
    addCollege() {
      this.$refs['newInfo'].validate(val => {
        if (val) {
          addCollegeInfo(this.newInfo).then(res => {
            this.$message.success(res.message)
            this.newInfo.id = ''
            this.newInfo.name = ''
            this.visible.new = false
          })
        } else {
          this.$message.error('信息不完整，无法提交')
        }
      })
    },

    // 提交更新的值
    onSubmit() {
      this.$refs['editInfo'].validate(val => {
        if (val) {
          updateCollegeInfo(this.editInfo).then(res => {
            this.$message.success(res.message)
            this.selectedRow.name = this.editInfo.name // 顺便同步更新表格的值
            this.visible.edit = false
          })
        } else {
          this.$message.error('信息不完整，提交失败')
        }
      })
    },
    edit(row) {
      this.editInfo.id = row.id
      this.editInfo.name = row.name
      this.selectedRow = row
      this.visible.edit = true
    },
    newRow() {
      this.visible.new = true
    },
    moreImport() {
      this.visible.import = true
    },
    // 拉取学院数据
    InitCollegeInfo(val) {
      if (!this.search) {
        const params = {
          pageNum: val,
          limit: 10
        }
        getCollegeInfo(params).then(res => {
          this.collegeInfo = res.data
        }).catch(error => {
          this.$message.error(error)
        })
      } else {
        SearchCollegeInfo({ id: this.search, pageNum: val, limit: 10 }).then(res => {
          this.collegeInfo = res.data
          this.total = res.data.length // 设置长度
        })
      }
    },
    getTotal() {
      getCollegecount().then(res => {
        this.$message.success(res.message)
        this.total = res.data
      }).catch(error => {
        this.$message.error(error + ':' + '获取失败')
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
