<template>
  <div>
    <div class="top">
      <el-select v-model="selectedCondition" style="width: 20%;" placeholder="请选择项目类型">
        <el-option
          v-for="item in category"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="search()">查询</el-button>
      <el-button type="success" style="margin-left: 10px;" icon="el-icon-s-data" :disabled="selectedCondition == ''?true:false" @click="arrangeReview()">批量指定评审专家</el-button>
      <el-button type="danger" style="margin-left: 10px;" :disabled="selectedCondition == ''?true:false" @click="removeReview()">批量清空项目评审专家</el-button>
    </div>
    <div class="middle">
      <el-table
        :data="projectInfo"
        border
        stripe
        max-height="500"
        @selection-change="handlemultiSelect"
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
            <el-tooltip class="item" effect="dark" content="查看评审专家" placement="left">
              <el-button size="small" icon="el-icon-s-custom" @click="read(scope.row.project_id)" />
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
    <!-- 批量指定评审专家窗口 -->
    <el-dialog
      title="批量指定评审专家"
      :close-on-click-modal="false"
      :visible.sync="visible.review_mul"
      width="50%"
    >
      <div style="margin-bottom: 20px;">
        <template>
          <el-radio v-model="radio" label="1">根据已选的项目指定评审专家</el-radio>
          <el-radio v-model="radio" label="2">为该项目类型下的所有项目指定评审专家</el-radio>
        </template>
      </div>

      <el-card v-if="radio == '1'" class="box-card">
        <div slot="header">
          <span>已选项目ID</span>
        </div>
        <span v-for="selected in mulData" :key="selected.project_id">
          {{ selected.project_id+' | ' }}
        </span>
        <br>
        <br>
        <span>
          共{{ mulData.length }}条
        </span>
      </el-card>
      <div style="margin-top:10px;font-weight: bold;font-size: 18px; margin-bottom: 10px;"><span>填写评审专家编号</span></div>
      <el-form ref="review_person" :model="review_person" style="margin-top: 10px; ">
        <el-form-item
          v-for="(expert, index) in review_person.expert"
          :key="expert.key"
          :label="'评审专家' + (index+1)"
          :prop="'expert.' + index + '.id'"
          :rules="{
            required: true, message: '评审专家编号不能够为空', trigger: 'blur'
          }"
        >
          <el-input v-model="expert.id" style="width: 60%;" />
          <el-button style="margin-left: 10px;" @click.prevent="addPerson()">+</el-button>
          <el-button @click.prevent="removePerson(expert)">-</el-button>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible.review_mul = false">取 消</el-button>
        <el-button type="primary" @click="submit()">指定</el-button>
      </span>
    </el-dialog>

    <!-- 查看评审专家 -->
    <el-dialog
      title="查看评审专家"
      :close-on-click-modal="false"
      :visible.sync="visible.reviewer"
      width="50%"
    >
      <el-card class="box-card">
        <div v-for="(reviewer,index ) in reviewers" :key="reviewer.id" style="margin-bottom: 10px;text-align: center; font-size: 20px;">
          {{ (index+1)+". "+reviewer.expert_id+'\t\t'+ reviewer. expert_name }}
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectCategory } from '@/api/project'
import { getProjectInfoForReview, getProjectCountForReview, setByProject, setByNotice, getResultAdmin, deleteByNotice, deleteByProject } from '@/api/review'
export default {
  data() {
    return {
      radio: '1',
      review_person: {
        expert: [{
          id: ''
        }]
      },
      visible: {
        review_mul: false,
        reviewer: false
      },
      category: [{}], // 项目类别
      projectInfo: [],
      reviewers: [
      ],
      selectedCondition: '',
      columns: [
        { id: 'project_id', label: '项目ID', width: '150' },
        { id: 'project_name', label: '项目名称' },
        { id: 'project_status', label: '项目状态', width: '150' },
        { id: 'preject_captain', label: '负责人', width: '200' }
      ],
      mulData: [],
      total: 0 // 项目的总条数 init 为 0
    }
  },
  mounted() {
    getProjectCategory().then(res => {
      this.category = res.data
    })
  },
  methods: {

    submit() {
      this.$refs['review_person'].validate(val => {
        if (val) {
          const experts = []
          this.review_person.expert.forEach(ele => {
            experts.push({ expert_id: ele.id })
          })
          if (this.radio === '1') {
            const projects = []
            this.mulData.forEach(element => {
              projects.push({ project_id: element.project_id })
            })
            setByProject({ experts: experts, projects: projects }).then(res => {
              this.$message.success(res.message)
            })
          } else {
            setByNotice({ notice_id: this.selectedCondition, experts: experts }).then(res => {
              this.$message.success(res.message)
            })
          }
        } else {
          this.$message.error('请输入完评审专家编号后再提交信息')
        }
      })
    },

    read(val) {
      getResultAdmin({ id: val }).then(res => {
        this.reviewers = res.data
      })
      this.visible.reviewer = true
    },
    removeReview() {
      if (this.mulData.length === 0) {
        this.$message({
          type: 'warn',
          message: '请先选择要评审的项目'
        })
      } else {
        this.$confirm('该操作将会批量清空原先指定好的评审专家记录，是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$confirm('是清空该项目类型下的所有评审专家(1)?还是清空已选的的项目的下的评审专家(2)?', '提示', {
            confirmButtonText: '2',
            cancelButtonText: '1',
            center: true,
            type: 'info'
          }).then(() => {
            const projects = []
            this.mulData.forEach(element => {
              projects.push({ project_id: element.project_id })
            })
            deleteByProject({ projects: projects }).then(res => {
              this.$message.success(res.message)
            })
          }).catch(() => {
            deleteByNotice({ notice_id: this.selectedCondition }).then(res => {
              this.$message.success(res.message)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 删除一列
    removePerson(expert) {
      var index = this.review_person.expert.indexOf(expert)
      if (index !== 0) { this.review_person.expert.splice(index, 1) }
    },
    // 增加一列
    addPerson() {
      this.review_person.expert.push({
        id: ''
      })
    },
    // 批量安排评审专家
    arrangeReview() {
      if (this.mulData.length === 0) {
        this.$message({
          type: 'warn',
          message: '请先选择要评审的项目'
        })
      } else {
        this.visible.review_mul = true
      }
    },
    handlemultiSelect(val) {
      this.mulData = val
      console.log(this.mulData)
    },
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
