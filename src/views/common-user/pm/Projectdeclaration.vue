<template>
  <div class="form">
    <p style="font-weight: bold;font-size: 23px; text-align: center;">项目申报</p>
    <el-form ref="projectData" :model="projectData" label-width="80px" :rules="rules">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="projectData.name" placeholder="请输入项目名称" />

      </el-form-item>

      <el-form-item label="项目类别" prop="category">
        <el-select v-model="projectData.category" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="captain">
        <el-input v-model="projectData.captain" placeholder="请输入项目负责人编号" />
      </el-form-item>
      <el-form-item label="指导老师">
        <el-input v-model="projectData.teacher" placeholder="请输入指导老师编号" />
      </el-form-item>
      <el-form-item
        v-for="(member, index) in projectData.members"
        :key="member.key"
        :label="'队员' + (index+1)"
        :prop="'members.' + index + '.value'"
        :rules="{required:true,message:'队员编号不能够为空',trigger:'blur'}"
      >
        <el-input v-model="member.value" style="width: 50%;" placeholder="请输入队员编号" />
        <el-button style="margin-left: 10px;" @click.prevent="addMember()">增加</el-button>
        <el-button @click.prevent="removeMember(member)">删除</el-button>
      </el-form-item>
      <el-form-item label="项目简介">
        <el-input
          v-model="projectData.introduce"
          type="textarea"
          :rows="8"
          placeholder="请输入项目简介"
          prop="introduce"
        />
      </el-form-item>
      <span style="font-size: 13px;color: brown;">附件的上传请前往《项目信息》->《操作》->《附件》进行</span>
    </el-form>
    <div class="button">
      <el-button type="primary" plain @click="submit()">提交</el-button>
    </div>

  </div>
</template>

<script>
import { getProjectCategory, applyProject } from '@/api/project'
export default {
  data() {
    return {
      options: [],
      projectData: {
        teacher: '',
        name: '',
        category: '',
        members: [{
          value: '',
          key: Date()
        }],
        captain: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '项目名称不能够为空', trigger: 'blur' }],
        category: [{ required: true, message: '项目类别不能够为空', trigger: 'blur' }],
        captain: [{ required: true, message: '负责人编号不能够为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getProjectCate()
  },
  methods: {
    getProjectCate() {
      getProjectCategory().then(res => {
        this.options = res.data
        this.$message.success(res.message)
      })
    },
    addMember() {
      this.projectData.members.push({ value: '', key: new Date() })
    },
    removeMember(item) {
      const index = this.projectData.members.indexOf(item)
      if (index !== -1) {
        this.projectData.members.splice(index, 1)
      }
    },
    submit() {
      const membersId = []
      this.projectData.members.forEach(element => {
        membersId.push(element.value)
      })
      const data = {
        name: this.projectData.name,
        category: this.projectData.category,
        captain: this.projectData.captain,
        introduce: this.projectData.introduce,
        members: membersId,
        teacher: this.projectData.teacher
      }
      console.log(data)
      this.$refs['projectData'].validate(val => {
        if (val) {
          applyProject(data).then(res => {
            this.$message.success(res.message)
          })
          this.$message.success('提交成功，若需提交附件，请在项目信息模块进行上传')
        } else {
          this.$message.error('请完善申报表的信息')
        }
      })
    }

  }
}

</script>
<style>
.form{
  width: 900px;
  margin: 0px auto;
  margin-top: 20px;
}
.button{
  text-align: center;
}
</style>
