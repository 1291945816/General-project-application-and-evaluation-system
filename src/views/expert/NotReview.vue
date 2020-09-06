<template>
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
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="getNotReviewProjectInfo(1)">筛选</el-button>
    </div>
    <div class="tablemain">
      <el-table
        :data="UnReviewProject"
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
            <el-button type="success" size="small" @click="clickReview(scope.row)">评审</el-button>
            <el-button type="primary" size="small" @click="download()">附件下载</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="pagespilt">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total"
        @current-change="getNotReviewProjectInfo"
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
        <el-form-item label="评分" prop="score">
          <el-input v-model="result.score" placeholder="请输入评分" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input
            v-model="result.comment"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="reviewDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProjectCategory } from '@/api/project'
import { ProjectNotReviewed, getNotReviewedCount, ProjectNotReviewedByType, reviewResult } from '@/api/review'
export default {
  name: 'NotReview',
  data() {
    return {
      category: [],
      selectedCondition: '',
      reviewDialog: false,
      columns: [
        { id: 'project_id', label: '项目ID', width: 200 },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_type', label: '项目类型', width: 200 }
      ],
      UnReviewProject: [],
      total: Number(0),
      project: Object(),
      result: {
        id: '',
        score: '',
        comment: ''
      },
      rules: {
        score: [{ required: true, message: '评分不能够为空', trigger: 'blur' },
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
    ProjectNotReviewed({ pageNum: 1, limit: 10 }).then(res => {
      this.UnReviewProject = res.data
    })
    getNotReviewedCount().then(res => {
      this.total = res.data
    })
  },
  methods: {
    submit() {
      this.$refs['review'].validate(val => {
        if (val) {
          reviewResult(this.result).then(res => {
            this.$message.success(res.message)
            this.reviewDialog = false
          })
        } else {
          this.$message.error('请检查评分输入是否符合要求！')
        }
      })
    },

    download() {
      console.log('下载附件')
    },

    clickReview(val) {
      this.result.score = ''
      this.project = val
      this.result.id = this.project.project_id
      this.reviewDialog = true
    },

    getNotReviewProjectInfo(val) {
      if (this.selectedCondition) {
        ProjectNotReviewedByType({ type: this.selectedCondition, pageNum: val, limit: 10 }).then(res => {
          this.UnReviewProject = res.data
        })
      } else {
        ProjectNotReviewed({ pageNum: val, limit: 10 }).then(res => {
          this.UnReviewProject = res.data
        })
      }
    }
  }
}
</script>
<style >
  .tablemain{
    margin-top: 10px;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(26, 10, 10, 0.12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .pagespilt{
    margin-top: 10px;

  }
</style>
