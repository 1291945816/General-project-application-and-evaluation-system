<template>
  <div>
    <div class="top">
      <el-select v-model="selectedCondition" placeholder="请选择项目类型">
        <el-option
          v-for="item in category"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="search()">查询</el-button>
      <el-button type="success" style="margin-left: 10px;" icon="el-icon-s-data">批量指定评审专家</el-button>
    </div>
    <div class="middle">
      <el-table
        :data="projectInfo"
        border
        stripe
        max-height="500"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="项目简介">
                <span>{{ props.row.project_intro }}</span>
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
          width="100"
        >

          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="指定评审专家" placement="left">
              <el-button size="small" icon="el-icon-s-custom" @click="edit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total"
        @current-change="getPageInfo"
      />

    </div>
  </div>
</template>

<script>
import { getProjectCategory } from '@/api/project'
import { getProjectInfoForReview, getProjectCountForReview } from '@/api/review'
export default {
  data() {
    return {
      category: [{}], // 项目类别
      projectInfo: [],
      selectedCondition: '',
      columns: [
        { id: 'project_id', label: '项目ID', width: '150' },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_status', label: '项目状态', width: '150' },
        { id: 'preject_captain', label: '负责人', width: '200' }
      ],
      total: 0 // 项目的总条数 init 为 0
    }
  },
  mounted() {
    getProjectCategory().then(res => {
      this.category = res.data
    })
  },
  methods: {
    search() {
      this.getPageInfo(1)
      if (this.selectedCondition) {
        getProjectCountForReview({ type: this.selectedCondition }).then(res => {
          this.total = res.data
        })
      }
    },
    getPageInfo(val) {
      if (this.selectedCondition) {
        getProjectInfoForReview({ type: this.selectedCondition, pageNum: val, limit: 10 }).then(res => {
          this.projectInfo = res.data
        })
      } else {
        this.$message.error('请先选择项目类型!')
      }
    }
  }
}

</script>

<style scoped>
.top{
  margin-top: 20px;
  margin-left:20px;
}
.middle{
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(26, 10, 10, 0.12), 0 0 6px rgba(0, 0, 0, .04);
}
.bottom{
  margin-left: 20px;
  margin-top: 10px;
}
</style>
