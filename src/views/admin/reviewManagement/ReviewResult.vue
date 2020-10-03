<template>
  <div>
    <!-- 这里是顶部栏 -->
    <div class="top">
      <el-select v-model="selectedCondition" placeholder="请选择项目类型">
        <el-option
          v-for="item in category"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input v-model="searchKeyword" style="width: 30%; margin-left: 10px;" placeholder="请输入项目名称关键字或可不填" />
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="search()">查询</el-button>
    </div>
    <!-- 这里是主体部分 -->
    <div class="mainBody">
      <el-table
        :data="projectInfo"
        border
        stripe
        max-height="500"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.id"
          :prop="col.id"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column
          label="操作"
          width="150"
        >

          <template slot-scope="scope">
            <el-tooltip effect="dark" content="评定结果" placement="left">
              <el-button size="small" icon="el-icon-s-custom" @click="read(scope.row)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="下载文件" placement="top">
              <el-button type="primary" icon="el-icon-download" circle @click="download(scope.row.project_id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 翻页 -->
    <div class="footer">
      <div class="bottom">
        <el-pagination
          background
          layout="total,prev, pager, next"
          :total="total"
          @current-change="getReviewedProjecrInfo"
        />
      </div>
    </div>
    <!-- 窗口弹出 -->
    <el-dialog
      :title="windowTitle"
      :visible.sync="windowVisible"
      :close-on-click-modal="false"
      width="70%"
    >
      <el-card style="text-align: center;">
        <h3>项目名称:{{ project.title }}</h3>
      </el-card>

      <h3>专家评审信息:</h3>
      <div class="throwWindow">
        <div
          v-for="item in projectExpert"
          :key="item.expert_id"
        >
          <el-card style="margin-right: 10px; width: 300px;margin-bottom: 10px;">
            <span style="font-weight: 700;">专家id: </span><span>{{ item.expert_id }}</span><br>
            专家姓名:<span>{{ item.expert_name }}</span><br>
            评审时间:<span>{{ item.review_time }}</span><br>
            评审打分:<span>{{ item.review_score }}</span><br>
            评审意见:<span>{{ item.review_comment }}</span><br>
          </el-card>
        </div>
      </div>

      <hr>
      <div style="text-align: center;">
        <span style="margin-right: 10px;">是否给予通过?</span>
        <template>
          <el-radio v-model="project.radio" label="1">通过</el-radio>
          <el-radio v-model="project.radio" label="2">未通过</el-radio>
        </template>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="windowVisible = false">取 消</el-button>
        <el-button type="primary" @click=" submit()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
// 获取项目类别
import { getProjectCategory } from '@/api/project'
import { getProjectInfoOnReviewing, getProjectCountOnReviewing, updateProjectStatus, getResultAdmin } from '@/api/projectResult'
export default {
  data() {
    return {
      windowTitle: '',
      windowVisible: false,
      category: [],
      selectedCondition: '',
      searchKeyword: '',
      total: 0,
      project: {
        id: '',
        title: '',
        radio: ''

      },
      projectExpert: [
      ],
      columns: [{ id: 'project_id', label: '项目ID', width: '150' },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_status', label: '项目状态', width: '180' },
        { id: 'preject_captain', label: '负责人', width: '200' }],
      projectInfo: []
    }
  },
  mounted() {
    getProjectCategory().then(res => {
      this.category = res.data
    })
  },
  methods: {
    search() {
      this.getReviewedProjecrInfo(1)
      if (this.selectedCondition) {
      // 获取项目的数量
        getProjectCountOnReviewing({ type: this.selectedCondition, keyword: this.searchKeyword.replace(/\s*/g, '') }).then(res => {
          this.total = res.data
        })
      }
    },
    // 返回评审中的项目
    getReviewedProjecrInfo(pageNum) {
      if (!this.selectedCondition) {
        this.$message.error('请先选择项目类型')
      } else {
        getProjectInfoOnReviewing({ pageNum: pageNum, limit: 10, type: this.selectedCondition, keyword: this.searchKeyword.replace(/\s*/g, '') }).then(
          res => {
            this.projectInfo = res.data
          }
        )
      }
    },
    read(row) {
      this.windowTitle = row.project_id + ''
      this.project.id = row.project_id
      this.project.title = row.project_name
      // 获取专家评审信息
      getResultAdmin({ id: this.project.id }).then(res => {
        this.projectExpert = res.data
      })
      if (row.project_status === '通过') this.project.radio = '1'
      else if (row.project_status === '未通过') this.project.radio = '2'
      this.windowVisible = true
    },
    submit() {
      if (this.project.radio === '') {
        this.$message.error('请选择是否给与通过')
      } else {
        updateProjectStatus({ id: this.project.id, status: this.project.radio === '1' ? '通过' : '未通过' }).then(res => {
          this.$message.success(res.message)
        })
        this.windowVisible = false
        this.project.id = ''
        this.project.title = ''
        this.project.radio = ''
      }
    },
    // 根据项目ID进行下载
    download() {
      this.$message.success('你点击了下载')
    }
  }
}
</script>
<style scoped>
  .top,.mainBody,.footer{
  margin-top: 20px;
  margin-left:20px;
  margin-right: 20px;
}
.footer{
  margin-top: 10px;
}
.mainBody{
  box-shadow: 0 2px 4px rgba(26, 10, 10, 0.12), 0 0 6px rgba(0, 0, 0, .04);
}
.throwWindow{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-family: '汉仪旗黑';
}

</style>
