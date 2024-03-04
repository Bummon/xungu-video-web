<template>
  <el-dialog
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    width="50%"
    draggable
  >
    <template #header>
      <span style="vertical-align: middle">
        <el-icon :size="28" class="no-inherit">
          <Edit />
        </el-icon>
      </span>
      <span style="vertical-align: middle"> {{ drawerProps.title }} </span>
    </template>
    <el-tabs v-model="tabPosition" type="border-card" @tab-click="handleClick">
      <el-tab-pane name="0" label="基础资料">
        <el-form
          ref="ruleFormRef"
          label-width="120px"
          label-suffix=" :"
          :rules="rules"
          :disabled="drawerProps.isView"
          :model="drawerProps.row"
          :hide-required-asterisk="drawerProps.isView"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题名称" prop="billTitle">
                <el-input v-model="drawerProps.row.billTitle" placeholder="请填写标题" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="机构" prop="orgId">
                <el-tree-select
                  style="width: 100%"
                  v-model="drawerProps.row!.orgId"
                  :data="orgOptions"
                  :props="orgProps"
                  check-strictly
                  :render-after-expand="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门" prop="deptId">
                <el-tree-select
                  style="width: 100%"
                  v-model="drawerProps.row!.deptId"
                  :data="deptOptions"
                  :props="props"
                  check-strictly
                  :render-after-expand="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="显示顺序" prop="billSort">
                <el-input-number
                  style="width: 100%"
                  v-model="drawerProps.row!.billSort"
                  :min="0"
                  placeholder="请填写顺序"
                  clearable
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="播放间隔(秒)" prop="billItemStep">
                <el-input-number
                  style="width: 100%"
                  v-model="drawerProps.row!.billItemStep"
                  :min="0"
                  placeholder="请填写播放间隔"
                  clearable
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="定时开" prop="billTimeOn">
                <el-date-picker
                  v-model="drawerProps.row!.billTimeOn"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetime"
                  placeholder="请选择时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="定时关" prop="billTimeOff">
                <el-date-picker
                  style="width: 100%"
                  v-model="drawerProps.row!.billTimeOff"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetime"
                  placeholder="请选择时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述" prop="billDescr">
            <el-input
              type="textarea"
              :rows="3"
              v-model="drawerProps.row!.billDescr"
              placeholder="请填写描述"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="1" label="多媒体文件">
        <el-row>
          <el-col :span="12" style="padding-left: 40px">
            <div class="top">
              <h4>多媒体文件</h4>
              <h4>已选：{{ selectList.length }}</h4>
            </div>
            <div class="left">
              <div v-for="item in allList" :key="item.libId">
                <span>{{ item.libFilename + item.libExt }}</span>
                <el-icon :size="18" color="#409EFC" @click="handleSelect(item)">
                  <Plus />
                </el-icon>
              </div>
              <div></div>
            </div>
          </el-col>
          <el-col :span="12" style="padding-left: 40px"
            ><h4>已选清单列表</h4>
            <div class="left">
              <div v-for="item in selectList" :key="item.libId">
                <span>{{ item.libFilename + item.libExt }}</span>
                <el-icon :size="18" color="red" @click="handleDelete(item)">
                  <Delete />
                </el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="2" label="终端选择">
        <ProTable
          ref="proTable"
          title="终端列表"
          row-key="terminalId"
          :indent="30"
          :columns="columns"
          :request-api="getTableLists"
          :pagination="true"
          :data-callback="dataCallback"
        >
          <!-- 菜单图标 -->
          <template #icon="scope">
            <el-icon :size="18">
              <component :is="scope.row.meta.icon"></component>
            </el-icon>
          </template>
        </ProTable>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogVisible" :destroy-on-close="true" width="30%" title="新增">
    <!--    <el-form ref="ruleFormRefs" label-width="110px" label-suffix=" :" :brand="addParams.value">-->
    <!--      <el-form-item label="显示顺序" prop="itemSort">-->
    <!--        <el-input-number-->
    <!--          style="width: 100%"-->
    <!--          v-brand="addParams.value!.itemSort"-->
    <!--          :min="0"-->
    <!--          placeholder="请填写顺序"-->
    <!--          clearable-->
    <!--        ></el-input-number>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="描述" prop="itemDescr">-->
    <!--        <el-input type="textarea" :rows="3" v-brand="addParams.itemDescr" placeholder="请填写描述" clearable></el-input>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SiteDrawer">
import { onMounted, ref, reactive, nextTick } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { BasePlay } from "@/api/interface/release/playList";
import { getDepartmentTree } from "@/api/modules/system1/department";
import { getOrganization } from "@/api/modules/system1/organization";
import { getAllList } from "@/api/modules/player/baseLibrary";
import { getDetailById } from "@/api/modules/release/playList";
import ProTable from "@/components/ProTable/index.vue";
import { getListByPage } from "@/api/modules/player/terminal";
import { BaseTerminal } from "@/api/interface/player/baseTerminal";
import { ColumnProps } from "@/components/ProTable/interface";
import type { TabsPaneContext } from "element-plus";
import { TableLabelEnum } from "@/enums/TableEnum";
import { PlanMedia } from "@/api/interface/player/playerPlanMedia";
// 表格配置项
const columns: ColumnProps<BaseTerminal.Terminal>[] = [
  { type: "selection", fixed: "left", width: 40 },
  { type: "index", label: "No", width: 50 },
  { prop: "terminalName", label: "终端名称", align: "left", width: 250 },
  { prop: "typeName", label: TableLabelEnum.Type, align: "left", width: 240 },
  { prop: "groupName", label: "所属分组", align: "left", width: 240 }
];

const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
onMounted(() => {
  getDeptTree();
  getOrgTree();
  getList();
});
const proTable = ref();
const getTableLists = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getListByPage(newParams);
};
let tabPosition = ref("0");
const rules = reactive({
  billTitle: [{ required: true, message: "请填写标题" }],
  billSort: [{ required: true, message: "请填写顺序" }],
  billItemStep: [{ required: true, message: "请填写播放间隔" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
  orgId: [{ required: true, message: "请选择机构", trigger: "change" }],
  billTimeOn: [{ required: true, message: "请选择时间", trigger: "change" }],
  billTimeOff: [{ required: true, message: "请选择时间", trigger: "change" }]
});
const props = {
  label: "deptName",
  children: "children",
  value: "deptId"
};
const orgProps = {
  label: "orgName",
  children: "children",
  value: "orgId"
};
//机构下拉框所有的值
let orgOptions = ref<any>([]);
const getOrgTree = async () => {
  const { data } = await getOrganization();
  orgOptions.value = data;
};
//部门下拉框所有的值
let deptOptions = ref<any>([]);
const getDeptTree = async () => {
  const { data } = await getDepartmentTree();
  deptOptions.value = data;
};

//获取所有文件列表
let allList = ref<any>([]);

const getList = async () => {
  const { data } = await getAllList();
  console.log(data);
  allList.value = data;
};
const addParams = reactive({});
let selectList = ref<any>([]);

// 由父组件传递过来的参数
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<PlanMedia.PlanMediaRow>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// 实例化请求来的数值
const drawerProps = ref<DrawerProps>();
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  selectList.value = [];
  terminalList.value = [];
  tabPosition = ref("0");
  if (params.title == "编辑") {
    await getDetail();
  }
  drawerVisible.value = true;
};
let terminalList = ref<any>([]);
const getDetail = async () => {
  const { data } = await getDetailById({ id: drawerProps.value.row.billId });
  terminalList.value = data.terminalList;
  allList.value.forEach(item => {
    data.mediaItemList.forEach(it => {
      if (item.libId == it.libId) {
        selectList.value.push(item);
      }
    });
  });
};
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  console.log(proTable.value);
  proTable.value?.clearSelection();
  if (tab.index == 2) {
    proTable.value?.tableData.forEach(item => {
      terminalList.value?.forEach(it => {
        if (item.terminalId == it.terminalId) {
          nextTick(() => {
            proTable.value?.element?.toggleRowSelection(item, true);
          });
        }
      });
    });
  }
};
const dialogVisible = ref(false);

const drawerVisible = ref(false);
console.log(proTable.value);

const handleSelect = item => {
  console.log(item);
  addParams.value = item;
  dialogVisible.value = true;
  // selectList.value.push(item);
  // selectList.value = [...new Set(selectList.value)];
  console.log(selectList);
};
const handleAdd = () => {
  selectList.value.push(addParams.value);
  selectList.value = [...new Set(selectList.value)];
  dialogVisible.value = false;
};
const handleDelete = item => {
  console.log(item);
  selectList.value = selectList.value.filter(items => {
    return items.libId != item.libId;
  });
  console.log(selectList);
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const handleSubmit = () => {
  console.log(proTable.value!.selectedListIds);
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    if (loading.value) return;
    if (proTable.value!.selectedListIds.length == 0) {
      ElMessage.warning({ message: "请选择终端", customClass: "messageIndex" });
      return;
    }
    if (selectList.value.length == 0) {
      ElMessage.warning({ message: "请选择多媒体文件", customClass: "messageIndex" });
      return;
    }
    try {
      loading.value = true;
      drawerProps.value.row.billType = 2;
      drawerProps.value.row.mediaItemList = selectList.value;
      drawerProps.value.row.terminalIdList = proTable.value!.selectedListIds;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}计划清单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });
};
defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.messageIndex {
  z-index: 3000 !important;
}
.top {
  display: flex;
  justify-content: space-between;
}
.left {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  padding: 20px;
  overflow-y: auto;
  border: 1px solid #6094e0;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
  }
}
</style>
