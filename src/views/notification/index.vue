<template>
  <div>
    <div class="buttonfot">
      <el-input v-model="search" placeholder="请输入标题" prefix-icon="el-icon-search" />
    </div>
    <div class="tableContain">
      <el-table
        :data="tableData"
        border
        stripe
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          prop="notice_id"
          label="通知ID"
          width="150"
        />
        <el-table-column
          prop="notice_title"
          label="标题"
        />
        <el-table-column
          prop="publish_time"
          label="发布时间"
          width="250"
        />
        <el-table-column
          prop="publish_person"
          label="发布人"
          width="200"
        />
        <el-table-column
          prop="operator"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="deatail(scope.row)">详情</el-button>
            <el-button type="success" size="small" @click="FiledownLoad(scope.row)">模板文件下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="totalnum"
        :page-size="10"
        @current-change="getData"
      />
    </div>

    <el-dialog title="通知详情" width="60%" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <div>
        <p style="font-size: 18px;"><span style="font-weight:bold">申报时间:</span> <el-tag style="margin-left: 10px;" effect="plain" type="warning">{{ applytimestart }}</el-tag> 至 <el-tag effect="plain" type="warning">{{ applytimeend }} </el-tag></p>
        <p style="font-size: 18px;"><span style="font-weight:bold">年度: </span> <el-tag style="margin-left: 10px;" type="warning">{{ annual }}</el-tag></p>
        <p style="font-size: 18px;"><span style="font-weight:bold">评审时间:</span> <el-tag style="margin-left: 10px;" effect="plain" type="danger">{{ reviewtimestart }}</el-tag> 至 <el-tag effect="plain" type="danger">{{ reviewtimeend }} </el-tag></p>
        <p style="font-size: 18px;margin-bottom: 5px;"><span style="font-weight:bold">项目类别:</span> <el-tag style="margin-left: 10px;" type="success">{{ notice_item_name }}</el-tag></p>
        <hr>
        <p class="content" v-html="notice_content" />
      </div>
    </el-dialog>

  </div></template>

<script>
import { formatDate } from '@/utils/timeHandle'
import { getNotificationList, getNotificationcount } from '@/api/notification'
export default {
  name: 'Notification',
  data() {
    return {
      totalnum: 0,
      search: '',
      tableData: [],
      dialogTableVisible: false,
      applytimestart: Date(),
      applytimeend: Date(),
      annual: '',
      reviewtimestart: Date(),
      reviewtimeend: Date(),
      notice_content: '',
      notice_item_name: ''

    }
  },
  created() {
    this.getData(1)
    this.getTotal()
  },
  methods: {
    getData(val) {
      var params = {
        pageNum: val,
        limit: 10

      }
      // 获取数据
      getNotificationList(params).then(response => {
        this.tableData = response.data
        for (let i = 0; i < this.tableData.length; ++i) {
          this.tableData[i].publish_time = formatDate(new Date(this.tableData[i].publish_time), 2)
        }
      })
    },
    // 获取总的数据数
    getTotal() {
      getNotificationcount().then(res => {
        this.totalnum = parseInt(res.data.count)
      })
    },
    deatail(value) {
      this.applytimestart = formatDate(new Date(value.applytimestart), 2)
      this.applytimeend = formatDate(new Date(value.applytimeend), 2)
      this.annual = value.annual
      this.notice_content = value.notice_content
      this.reviewtimestart = formatDate(new Date(value.reviewtimestart), 2)
      this.reviewtimeend = formatDate(new Date(value.reviewtimeend), 2)
      this.notice_item_name = value.notice_item_name
      this.dialogTableVisible = true
    },
    FiledownLoad(val) {
      console.log('开始下载')
    }
  }
}
</script>

<style>
  .tableContain{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  }
  .pagination{
    margin-top: 20px;
    margin-left: 20px;
  }
  .buttonfot{
    width: 300px;
    margin-top: 20px;
    margin-left: 20px;
  }
  .content{
    margin-top: 10px;
    margin-left: 2px;
  }

</style>
