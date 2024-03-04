<template>
  <div class="table-box">
    <div class="card" style="margin-bottom: 10px; overflow: hidden">
      <el-form ref="ruleFormRef" label-width="100px" :model="pageable">
        <el-row>
          <el-col :span="4">
            <el-form-item label="执行器 :" prop="jobGroup">
              <el-select v-model="pageable.jobGroup" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in groupList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态 :" prop="triggerStatus">
              <el-select v-model="pageable.triggerStatus" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in siteOptions" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="任务描述 :" prop="jobDesc">
              <el-input v-model="pageable.jobDesc" placeholder="请输入任务描述" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="JobHandler :" prop="executorHandler">
              <el-input v-model="pageable.executorHandler" placeholder="请输入JobHandler" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="负责人 :" prop="author">
              <el-input v-model="pageable.author" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display: flex; justify-content: end">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="Search">搜索</el-button>
              <el-button icon="Delete" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="card" style="height: 100%">
      <el-button style="float: right; margin-bottom: 15px" type="primary" icon="CirclePlus" @click="handleEdit('新增')"
        >新增
      </el-button>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="任务ID" align="center" />
        <el-table-column label="任务描述" prop="jobDesc" align="center" />
        <el-table-column label="调度类型" align="center">
          <template #default="scope">
            <span>{{ scope.row.scheduleType }} : {{ scope.row.scheduleConf }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行模式" align="center">
          <template #default="scope">
            <span>{{ scope.row.glueType }} : {{ scope.row.executorHandler }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" align="center" label="负责人" />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.triggerStatus == 0" type="info">STOP</el-tag>
            <el-tag v-else type="success">RUNNING</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <!-- <el-button v-if="scope.row.triggerStatus == 0" type="primary" link icon="Open" @click="handleIsStart(scope.row)"
              >启动</el-button
            >
            <el-button v-if="scope.row.triggerStatus == 1" type="primary" link icon="TurnOff" @click="handleIsStart(scope.row)"
              >停止</el-button
            > -->
            <el-button type="primary" link icon="edit" @click="handleEdit('更新任务', scope.row)">编辑</el-button>
            <el-button type="primary" icon="delete" link @click="handleDelete(scope.row)">删除</el-button>
            <el-dropdown size="small" trigger="click">
              <el-button type="primary" link style="margin-top: 3px; margin-left: 5px; font-size: 13px">
                更多
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="scope.row.triggerStatus == 0" @click="handleIsStart(scope.row)">启动 </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.triggerStatus == 1" @click="handleIsStart(scope.row)">停止 </el-dropdown-item>
                  <el-dropdown-item @click="handleTrigger(scope.row)">执行一次</el-dropdown-item>
                  <el-dropdown-item @click="handleLog(scope.row)">查询日志</el-dropdown-item>
                  <el-dropdown-item @click="handleLoad(scope.row)">注册节点</el-dropdown-item>
                  <el-dropdown-item @click="handleNext(scope.row)">下次执行时间</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="pageable.start"
        :page-size="pageable.length"
        :page-sizes="[10, 25, 50, 100]"
        :total="pageable.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog v-model="dialogVisible" width="50%" :title="titles">
      <el-form ref="ruleFormRefs" :rules="rules" label-width="120px" :model="form">
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee">
          <span>基础配置</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行器 :" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in groupList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务描述 :" prop="jobDesc">
              <el-input v-model="form.jobDesc" placeholder="请输入任务描述" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人 :" prop="author">
              <el-input v-model="form.author" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警邮件 :" prop="alarmEmail">
              <el-input v-model="form.alarmEmail" placeholder="请输入报警邮件,多个邮件地址用逗号分开" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee">
          <span>调度配置</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度类型 :" prop="scheduleType">
              <el-select v-model="form.scheduleType" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in scheduleTypeList" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.scheduleType == 'CRON'">
            <el-form-item label="Cron :" prop="scheduleConf">
              <el-input v-model="state.cron" placeholder="cron表达式...">
                <template #append>
                  <el-popover v-model:visible="state.cronPopover" width="700px" trigger="manual">
                    <noVue3Cron
                      :cron-value="state.cron"
                      @change="changeCron"
                      @close="state.cronPopover = false"
                      max-height="400px"
                      i18n="cn"
                    ></noVue3Cron>
                    <template #reference>
                      <el-button @click="state.cronPopover = !state.cronPopover">设置</el-button>
                    </template>
                  </el-popover>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.scheduleType == 'FIX_RATE'">
            <el-form-item label="固定速度 :" prop="scheduleConf">
              <el-input v-model="form.scheduleConf" placeholder="请输入（Second）" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee">
          <span>任务配置</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="运行模式 :" prop="glueType">
              <el-select :disabled="titles == '更新任务'" v-model="form.glueType" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in glueList" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.glueType == 'BEAN'">
            <el-form-item label="JobHandler :" prop="executorHandler">
              <el-input
                :disabled="form.glueType != 'BEAN'"
                v-model="form.executorHandler"
                placeholder="请输入JobHandler"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务参数 :" prop="executorParam">
              <el-input type="textarea" :rows="3" v-model="form.executorParam" placeholder="请输入任务参数" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eeeeee">
          <span>高级配置</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由策略 :" prop="executorRouteStrategy">
              <el-select v-model="form.executorRouteStrategy" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in routerList" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子任务ID :" prop="childJobId">
              <el-input v-model="form.childJobId" placeholder="请输入子任务ID,如存在多个用逗号分开" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度过期策略 :" prop="misfireStrategy">
              <el-select v-model="form.misfireStrategy" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in misfireList" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阻塞处理策略 :" prop="executorBlockStrategy">
              <el-select v-model="form.executorBlockStrategy" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in executorBlockList" :key="item.value" :label="item.lable" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务超时时间 :" prop="executorTimeout">
              <el-input v-model="form.executorTimeout" placeholder="任务超时时间,单位秒,大于零时生效" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失败重试次数 :" prop="executorFailRetryCount">
              <el-input v-model="form.executorFailRetryCount" placeholder="失败重试次数,大于零时生效" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit(ruleFormRefs)">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 注册节点 -->
    <el-dialog v-model="loadDialog" :title="title" width="20%" align-center>
      <div v-for="(it, index) in loadOptions" :key="index">
        <span>{{ index + 1 }}、</span><span>{{ it }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="loadDialog = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 执行一次 -->
    <el-dialog v-model="triggerDialog" title="执行一次" width="30%">
      <el-form ref="formRef" label-width="100px" :model="triggerForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务参数 :" prop="executorParam">
              <el-input
                type="textarea"
                :rows="3"
                v-model="triggerForm.executorParam"
                placeholder="请输入任务参数"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="机器地址 :" prop="addressList">
              <el-input
                type="textarea"
                :rows="3"
                v-model="triggerForm.addressList"
                placeholder="请输入本次执行的机器地址，为空则从执行器获取"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="triggerDialog = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="SiteManage">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import {
  getListByPage,
  addRow,
  updateRow,
  deleteRows,
  startRows,
  stopRows,
  nextTriggerTime,
  trigger
} from "@/api/modules/job/jobInfo";
import { getListByGroup, loadById } from "@/api/modules/job/jobGroup";
import { noVue3Cron } from "no-vue3-cron";
import "no-vue3-cron/lib/noVue3Cron.css"; // 引入样式
const state = reactive({
  cronPopover: false,
  cron: ""
});
const changeCron = (val: any) => {
  if (typeof val !== "string") return false;
  state.cron = val;
  form.value.scheduleConf = val;
};

onMounted(() => {
  getGroupList();
  getTableList();
});
const rules = reactive({
  jobGroup: [{ required: true, message: "请选择执行器", trigger: "change" }],
  jobDesc: [{ required: true, message: "请填写任务描述" }],
  author: [{ required: true, message: "请填写负责人" }],
  scheduleConf: [{ required: true, message: "请填写", trigger: "change" }],
  scheduleType: [{ required: true, message: "请填写", trigger: "change" }],
  glueType: [{ required: true, message: "请填写", trigger: "change" }],
  executorHandler: [{ required: true, message: "请填写JobHandler" }]
});
let pageable = reactive({
  start: 0,
  length: 10,
  total: 0,
  triggerStatus: -1,
  jobGroup: 0,
  author: "",
  jobDesc: "",
  executorHandler: ""
});
//状态数据
let siteOptions = [
  { lable: "全部", value: -1 },
  { lable: "停止", value: 0 },
  { lable: "启动", value: 1 }
];
let scheduleTypeList = [
  { lable: "无", value: "NONE" },
  { lable: "CRON", value: "CRON" },
  { lable: "固定速度", value: "FIX_RATE" }
];
let misfireList = [
  { lable: "忽略", value: "DO_NOTHING" },
  { lable: "立即执行一次", value: "FIRE_ONCE_NOW" }
];
let executorBlockList = [
  { lable: "单机串行", value: "SERIAL_EXECUTION" },
  { lable: "丢弃后续调度", value: "DISCARD_LATER" },
  { lable: "覆盖之前调度", value: "COVER_EARLY" }
];
let glueList = [
  { lable: "BEAN", value: "BEAN" },
  { lable: "GLUE(Java)", value: "GLUE_GROOVY" },
  { lable: "GLUE(Shell)", value: "GLUE_SHELL" },
  { lable: "GLUE(Phthon)", value: "GLUE_PYTHON" },
  { lable: "GLUE(PHP)", value: "GLUE_PHP" },
  { lable: "GLUE(Nodejs)", value: "GLUE_NODEJS" },
  { lable: "GLUE(PowerShell)", value: "GLUE_POWERSHELL" }
];
let routerList = [
  { lable: "第一个", value: "FIRST" },
  { lable: "最后一个", value: "LAST" },
  { lable: "轮询", value: "ROUND" },
  { lable: "随机", value: "RANDOM" },
  { lable: "一致性HASH", value: "CONSISTENT_HASH" },
  { lable: "最不经常使用", value: "LEAST_FREQUENTLY_USED" },
  { lable: "最近最久未使用", value: "LEAST_RECENTLY_USED" },
  { lable: "故障转移", value: "FAILOVER" },
  { lable: "忙碌转移", value: "BUSYOVER" },
  { lable: "分片广播", value: "SHARDING_BROADCAST" }
];
//执行器数据
let groupList = ref<any>([]);
const getGroupList = async () => {
  const res = await getListByGroup();
  console.log(res);
  res.data.forEach(it => {
    groupList.value.push({ id: it.id, title: it.title });
  });
  pageable.jobGroup = groupList.value[0].id;
};

//搜索
const Search = () => {
  getTableList();
};
//重置
const reset = () => {
  pageable.start = 0;
  pageable.length = 10;
  pageable.triggerStatus = -1;
  pageable.jobGroup = groupList.value[0].id;
  pageable.author = "";
  pageable.jobDesc = "";
  pageable.executorHandler = "";
  getTableList();
};

//表格数据
let tableData = ref<any>([]);
const getTableList = async () => {
  let formData = new FormData();
  formData.append("start", pageable.start);
  formData.append("length", pageable.length);
  formData.append("jobGroup", pageable.jobGroup);
  formData.append("triggerStatus", pageable.triggerStatus);
  const res = await getListByPage(formData);
  console.log(res);
  pageable.total = res.recordsTotal;
  tableData.value = res.data;
  console.log(pageable);
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
const ruleFormRefs = ref<FormInstance>();

//查看详情
interface Form {
  jobGroup: bigint;
  author: string;
  jobDesc: string;
  alarmEmail: string;
  scheduleType: string;
  scheduleConf: string;
  glueType: string;
  executorHandler: string;
  executorParam: string;
  executorRouteStrategy: string;
  childJobId: string;
  misfireStrategy: string;
  executorBlockStrategy: string;
  executorTimeout: string;
  executorFailRetryCount: string;
}

let form = ref<Form>({});
let dialogVisible = ref(false);
let titles = "";
const handleEdit = (title: string, row: any) => {
  console.log(title);
  titles = title;
  if (row) {
    row.addTime = dateToStr(row.addTime);
    row.glueUpdatetime = dateToStr(row.glueUpdatetime);
    row.updateTime = dateToStr(row.updateTime);
    form.value = row;
    state.cron = row.scheduleConf;
  } else {
    form.value = {};
    state.cron = "";
    form.value.jobGroup = groupList.value[0].id;
    form.value.scheduleType = scheduleTypeList[1].value;
    form.value.glueType = glueList[0].value;
    form.value.executorRouteStrategy = routerList[0].value;
    form.value.misfireStrategy = misfireList[0].value;
    form.value.executorBlockStrategy = executorBlockList[0].value;
  }
  dialogVisible.value = true;
};
const getFormData = (object: any) => {
  const formData = new FormData();
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => {
        formData.append(key + `[${i}]`, subValue);
      });
    } else {
      formData.append(key, object[key]);
    }
  });
  return formData;
};
const loading = ref(false);
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (loading.value) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        console.log("submit!");
        form.value.scheduleConf = state.cron;
        if (form.value.scheduleType == "CRON") {
          form.value.schedule_conf_CRON = form.value.scheduleConf;
          form.value.cronGen_display = form.value.scheduleConf;
        }
        let formData = getFormData(form.value);

        if (titles == "新增") {
          const res = await addRow(formData);
          if (res.code == 200) {
            ElMessage.success({ message: `新增成功！` });
            reset();
          }
          console.log(res);
        } else {
          formData.delete("addTime");
          formData.delete("glueUpdatetime");
          formData.delete("updateTime");
          if (form.value.childJobId == null) {
            formData.delete("childJobId");
          }
          const res = await updateRow(formData);
          if (res.code == 200) {
            ElMessage.success({ message: `更新成功！` });
            reset();
          }
          console.log(res);
        }
        dialogVisible.value = false;
      } catch (e) {
        console.log(e);
      } finally {
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const handleClose = () => {
  form.value = {};
  state.cron = "";
  form.value.jobDesc = undefined;
  form.value.author = undefined;
  form.value.jobGroup = groupList.value[0].id;
  form.value.scheduleConf = undefined;
  form.value.scheduleType = scheduleTypeList[1].value;
  form.value.glueType = glueList[0].value;
  form.value.executorRouteStrategy = routerList[0].value;
  form.value.misfireStrategy = misfireList[0].value;
  form.value.executorBlockStrategy = executorBlockList[0].value;
  dialogVisible.value = false;
};
//分页数据
const handleSizeChange = (val: any) => {
  console.log(val);
  pageable.length = val;
  getTableList();
};
const handleCurrentChange = (val: any) => {
  pageable.start = val * 10 - 10;
  console.log(val);
  getTableList();
};
const handleDelete = async (params: any) => {
  let formData = new FormData();
  formData.append("id", params.id);
  await useHandleData(deleteRows, formData, `确定删除`);
  reset();
};
const handleIsStart = async (params: any) => {
  let formData = new FormData();
  formData.append("id", params.id);
  if (params.triggerStatus == 0) {
    await useHandleData(startRows, formData, `启动`);
  } else {
    await useHandleData(stopRows, formData, `停止`);
  }
  reset();
};
//执行一次
let triggerForm = reactive({});
let triggerDialog = ref(false);
let triggerId = "";
const handleTrigger = async (params: any) => {
  triggerDialog.value = true;
  triggerId = params.id;
  // let formData = new FormData();
  // formData.append("id", params.id);
  // await useHandleData(deleteRows, formData, `确定删除`);
};
const submit = async () => {
  let formData = new FormData();
  formData.append("id", triggerId);
  console.log(triggerForm);
  formData.append("executorParam", triggerForm.executorParam);
  formData.append("addressList", triggerForm.addressList);
  const res = await trigger(formData);
  if (res.code == 200) {
    triggerDialog.value = false;
    ElMessage.success({ message: `执行成功！` });
    reset();
  }
};

const router = useRouter();

//查询日志
const handleLog = async (params: any) => {
  console.log(params);

  router.push(`/job/jobLog?id=${params.id}&jobGroup=${params.jobGroup}`);
};
//注册节点
let title = "";
let loadDialog = ref(false);
let loadOptions = ref<any>([]);
const handleLoad = async (params: any) => {
  title = "注册节点";
  loadDialog.value = true;
  loadOptions.value = [];
  let formData = new FormData();
  formData.append("id", params.id);
  const res = await loadById(formData);
  if (res.data == 200) {
    loadOptions.value = res.content.addressList?.split(",");
  } else {
    loadOptions.value = [];
  }
};
//下次执行时间
const handleNext = async (params: any) => {
  title = "下次执行时间";
  loadDialog.value = true;
  loadOptions.value = [];
  let formData = new FormData();
  formData.append("scheduleType", params.scheduleType);
  formData.append("scheduleConf", params.scheduleConf);
  const res = await nextTriggerTime(formData);
  loadOptions.value = res.content;
};
</script>
<style scoped lang="scss">
:deep(.example-showcase .el-dropdown + .el-dropdown) {
  margin-left: 15px;
}
</style>
