<!--  * 逻辑层所有的组件都是异步加载的 因为本身都比较大-->
<!--  * 所有的透传采用hooks挂载传递 最终实现状态同步-->
<!--  * 切勿乱动这个大模块里面的代码 *-->
<!--  * 项目中其他文件夹有不知道干什么的代码 切勿随便删除 *-->
<!--  * by 党亚南-->

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="布局列表"
      row-key="layoutId"
      :indent="20"
      :columns="layout.columns"
      :request-api="layout.getInitDataListApi"
      :init-param="initParam"
      :pagination="true"
      :data-callback="layout.dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="layout.openDialog('新增布局', true)">添加布局</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!--      开关操作-->
      <template #layoutStatus="scope">
        <el-switch
          v-model="scope.row.layoutStatus"
          :active-value="1"
          :inactive-value="0"
          :beforeChange="changeStatus.bind(this, scope.row)"
        ></el-switch>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link icon="EditPen" @click="layout.openDialog('编辑', false, scope.row)">编辑 </el-button>
        <el-button type="primary" link icon="Delete" @click="layout.deleteRow(scope.row)">删除 </el-button>
      </template>
    </ProTable>
    <diyLayoutDrawer ref="dialogRef"></diyLayoutDrawer>
  </div>
</template>

<script setup lang="ts" name="custom">
// 组件类-
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import diyLayoutDrawer from "@/views/mainData/diyLayout/diyLayoutDrawer.vue";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();
// 接口类
import { changeStatusById, DiyLayoutDeleteRow, getLayoutListByPage } from "@/api/modules/player/diyLayout";
import { ProTableEnums } from "@/enums/ProtableEnum";
import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";
import { DrawerProps } from "./index";
import { TableLabelEnum, TableWidthEnum } from "@/enums/TableEnum";
import { ReqPage } from "@/api/interface";

const dialogRef = ref<InstanceType<typeof diyLayoutDrawer> | null>(null);
const proTable = ref();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ statusType: 1 });

class Layout {
  private readonly name: string;
  readonly columns: ColumnProps<BaseDiyLayout.DiyLayout>[]; //表格设计
  constructor() {
    this.name = "Layout";
    // 表格配置项
    this.columns = [
      { type: "selection", width: TableWidthEnum.Select, fixed: "left" },
      { type: "index", label: "No", width: TableWidthEnum.Index },
      {
        prop: "layoutTitle",
        label: "名称",
        align: "left",
        width: TableWidthEnum.Name,
        search: { el: ProTableEnums.SearchEnum.Input }
      },
      { prop: "layoutDescr", label: TableLabelEnum.Descr, align: "left" },
      { prop: "layoutStatus", label: TableLabelEnum.Status, width: TableWidthEnum.Status, align: "left" },
      { prop: "modifyTime", label: TableLabelEnum.ModifyTime, width: TableWidthEnum.LongTime, align: "left" },
      { prop: "operation", label: TableLabelEnum.Operation, width: TableWidthEnum.Handle2, fixed: "right" }
    ];
  }

  /**
   * @description 获取初始化数据
   *
   */
  getInitDataListApi(params: ReqPage) {
    // 使用默认的参数 pageNum=1 pageSize=10  有特殊修改再说
    let newParams = JSON.parse(JSON.stringify(params));
    return getLayoutListByPage(newParams);
  }

  // 查询之后数据返还  如果无需处理 可以直接不用
  dataCallback(data: BaseDiyLayout.DiyLayoutList) {
    return {
      list: data.data,
      total: data.total,
      pageNum: data.pageNum,
      pageSize: data.pageSize
    };
  }

  /**
   * @description 打开弹窗  通过传递title的不同 加载不同的内容
   * @param title
   * @param row
   */
  openDialog(title: string, isAdd: boolean, row: Partial<BaseDiyLayout.DiyLayout> = {}) {
    const params: DrawerProps = {
      title,
      isAdd: isAdd,
      row: title === "新增布局" ? {} : { ...row }
    };
    dialogRef.value?.acceptParams(params);
  }

  /**
   * 删除行
   * @param params
   */
  async deleteRow(params: BaseDiyLayout.DiyLayout) {
    await useHandleData(DiyLayoutDeleteRow, { ids: [params.layoutId] }, `删除【${params.layoutTitle}】的布局`);
    proTable.value?.getTableList();
  }
}

const layout = new Layout();

/**
 * @description 切换布局的状态 el-switch
 * @param {sysApp.app} 行数据(必传)
 * @return {Promise<boolean>} el-switch只接受boolean返回值
 */
const changeStatus = async (params: BaseDiyLayout.DiyLayout): Promise<boolean> => {
  const newStatus = params.layoutStatus === 1 ? 0 : 1;
  const requestData = { layoutId: params.layoutId, layoutStatus: newStatus };
  const message = `切换【${params.layoutTitle}】应用状态`;
  try {
    await useHandleData(changeStatusById, requestData, message);
    await proTable.value?.getTableList();
    return true;
  } catch (e) {
    return false;
  }
};
</script>
