<template>
  <div>
    <div>
      <div class="filtter">
        <el-select v-model="selectedCondition" placeholder="请选择">
          <el-option
            v-for="item in category"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="getReviewProjectInfo(1)">筛选</el-button>
      </div>
    </div>
    <div class="tablemain">
      <el-table
        :data="ReviewedProject"
        border
        stripe
        max-height="500"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
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
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="changeReview(scope.row)">评审修改</el-button>
            <el-button type="danger" size="small" @click="undoReview(scope.$index,scope.row)">撤销评审</el-button>
            <el-button type="primary" size="small" @click="download(scope.row)">附件下载</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="pagespilt">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total"
        @current-change="getReviewProjectInfo"
      /></div>

    <!-- 评审窗口 -->
    <el-dialog
      title="项目评审"
      :visible.sync="reviewDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="review" :model="result" status-icon :rules="rules" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="project.project_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="评审时间">
          <el-input v-model="result.review_time" :disabled="true" />
        </el-form-item>
        <el-form-item label="评分" prop="review_score">
          <el-input v-model="result.review_score" placeholder="请输入评分" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input
            v-model="result.review_comment"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="reviewDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">更新</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { getProjectCategory } from '@/api/project'
import { getReviewedCount, ProjectReviewed, ProjectReviewedByType, undoReviewResult, getReviewResult, updateReviewResult } from '@/api/review'
export default {
  data() {
    return {
      category: [],
      selectedCondition: '',
      total: 10,
      reviewDialog: false,
      columns: [
        { id: 'project_id', label: '项目ID', width: 200 },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_type', label: '项目类型', width: 200 }
      ],
      ReviewedProject: [],
      project: Object(), // 选中行
      result: {
        review_time: '',
        review_score: '',
        review_comment: ''
      },
      rules: {
        review_score: [{ required: true, message: '评分不能够为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            var reg = /^-?\d{1,3}(?:\.\d{1,3})?$/
            if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('请输入整数不大于100且小数位低于3位的数字'))
            }
          },
          trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    getProjectCategory().then(res => {
      this.category = res.data
      this.category.push({})
    })
    getReviewedCount().then(res => {
      this.total = res.data
    })
    ProjectReviewed({ pageNum: 1, limit: 10 }).then(res => {
      this.ReviewedProject = res.data
    })
  },
  methods: {

    /**
     * 打开评审窗口 初始化评审数据
     * */
    changeReview(val) {
      this.project = val
      this.reviewDialog = true
      getReviewResult({ id: val.project_id }).then(res => {
        // 获取评审数据
        this.result = res.data
      })
    },

    /**
     * 提交更新
     */

    submit() {
      this.$refs['review'].validate(val => {
        if (val) {
          updateReviewResult({ id: this.project.project_id, score: this.result.review_score, comment: this.result.review_comment })
        } else {
          this.$message.error('请输入符合格式的评分结果!')
        }
      })
    },
    /**
     *
     *撤销评审
     */
    undoReview(index, val) {
      this.$confirm('此操作将永久撤销你的评审结果, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        undoReviewResult({ id: val.project_id }).then(res => {
          this.$message.success(res.message)
          this.ReviewedProject.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        })
      })
    },
    /**
     *
     *
     * 附件下载
    */
    download(val) {
      console.log('附件下载')
    },

    // 获取评审项目的信息
    getReviewProjectInfo(val) {
      if (this.selectedCondition) {
        ProjectReviewedByType({ type: this.selectedCondition, pageNum: val, limit: 10 }).then(res => {
          this.ReviewedProject = res.data
        })
      } else {
        ProjectReviewed({ pageNum: val, limit: 10 }).then(res => {
          this.ReviewedProject = res.data
        })
      }
    }
  }

}

</script>
