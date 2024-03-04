<template>
  <div class="table-box">
    <div class="card" style="margin-bottom: 10px; overflow: hidden">
      <el-form ref="ruleFormRef" label-width="100px" :model="pageable">
        <el-row>
          <el-col :span="6">
            <el-form-item label="执行器 :" prop="jobGroup">
              <el-select v-model="pageable.jobGroup" @change="changeGroup" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in groupList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务 :" prop="jobId">
              <el-select v-model="pageable.jobId" placeholder="请选择任务" style="width: 100%">
                <el-option v-for="item in jobOptions" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态 :" prop="logStatus">
              <el-select v-model="pageable.logStatus" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in siteOptions" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex; justify-content: end">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="Search">搜索</el-button>
              <el-button icon="Delete" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="card" style="height: 100%">
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="任务ID" align="center" />
        <el-table-column label="调度时间" align="center">
          <template #default="scope">
            <span>{{ dateToStr(scope.row.triggerTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调度结果" align="center">
          <template #default="scope">
            <span style="color: #009688" v-if="scope.row.triggerCode === 200">成功</span>
            <span style="color: red" v-else>失败</span>
          </template>
        </el-table-column>
        <el-table-column label="调度备注" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="toDetail(scope.row)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="triggerCode" align="center" label="执行时间" />
        <el-table-column prop="triggerCode" align="center" label="执行结果" />
        <el-table-column prop="triggerCode" align="center" label="执行备注" />
        <el-table-column label="操作" align="center" />
      </el-table>
      <el-pagination
        :background="true"
        :current-page="pageable.start"
        :page-size="pageable.length"
        :page-sizes="[10, 25, 50, 100]"
        :total="pageable.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog v-model="centerDialogVisible" width="28%" title="调度备注" center>
      <div v-html="params.value?.triggerMsg"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="SiteManage">
import { ref, reactive, onMounted } from "vue";
import { getListByPage, getJobsByGroup } from "@/api/modules/job/jobLog";
import { getListByGroup } from "@/api/modules/job/jobGroup";
import { useRoute } from "vue-router";

onMounted(() => {
  getGroupList();
  getTableList();
});
const route = useRoute();
console.log(route.query);

let pageable = ref({
  start: 1,
  length: 10,
  total: 0,
  logStatus: -1,
  jobId: 0,
  jobGroup: 0
});
//状态数据
let siteOptions = [
  { lable: "全部", value: -1 },
  { lable: "成功", value: 1 },
  { lable: "失败", value: 2 },
  { lable: "进行中", value: 3 }
];
//执行器数据
let groupList = ref<any>([]);
const getGroupList = async () => {
  const res = await getListByGroup();
  console.log(res);
  groupList.value = [{ id: 0, title: "全部" }];
  res.data.forEach(it => {
    groupList.value.push({ id: it.id, title: it.title });
  });
  if (route.query.jobGroup) {
    pageable.value.jobGroup = Number(route.query.jobGroup);
    changeGroup(Number(route.query.jobGroup));
  } else {
    pageable.value.jobGroup = groupList.value[0].id;
  }
};
//任务数据
let jobOptions = ref<any>([]);
jobOptions.value = [{ id: 0, title: "全部" }];
if (route.query.id) {
  pageable.value.jobId = Number(route.query.id);
} else {
  pageable.value.jobId = jobOptions.value[0].id;
}
pageable.value.logStatus = siteOptions[0].value;
const changeGroup = async val => {
  let formData = new FormData();
  formData.append("jobGroup", val);
  const res = await getJobsByGroup(formData);
  res.content.forEach(it => {
    jobOptions.value.push({ id: it.id, title: it.jobDesc });
  });
};

//搜索
const Search = () => {
  getTableList();
};
//重置
const reset = () => {
  pageable.value.start = 1;
  pageable.value.length = 10;
  pageable.value.logStatus = -1;
  pageable.value.jobId = 0;
  pageable.value.jobGroup = 0;
  getTableList();
};
//日期格式化
const dateToStr = datetime => {
  let datetimes = new Date(datetime);
  let year = datetimes.getFullYear();
  let month = datetimes.getMonth() + 1; //js从0开始取
  let date = datetimes.getDate();
  let hour = datetimes.getHours();
  let m = datetimes.getMinutes();
  let s = datetimes.getSeconds();
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return year + "-" + month + "-" + date + " " + hour + ":" + m + ":" + s;
};
//表格数据
let tableData = ref<any>([]);
let pageNum = ref(0);
const getTableList = async () => {
  let formData = new FormData();
  formData.append("start", pageNum.value);
  formData.append("length", pageable.value.length);
  formData.append("jobGroup", pageable.value.jobGroup);
  formData.append("jobId", pageable.value.jobId);
  formData.append("logStatus", pageable.value.logStatus);
  const res = await getListByPage(formData);
  console.log(res);

  pageable.value.total = res.recordsTotal;
  tableData.value = res.data;
  console.log(pageable.value);
};
//查看详情
let params = reactive({});
let centerDialogVisible = ref(false);
const toDetail = row => {
  console.log(row);
  params.value = row;
  centerDialogVisible.value = true;
};
//分页数据
const handleSizeChange = val => {
  console.log(val);
  pageable.value.length = val;
  getTableList();
};
const handleCurrentChange = val => {
  pageNum.value = val - 1;
  pageable.value.start = val;
  getTableList();
};
</script>
