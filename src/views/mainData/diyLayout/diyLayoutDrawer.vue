<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="100vw"
    :title="`${drawerProps.title}`"
    :close-on-click-modal="false"
    :modal="false"
    :with-header="false"
  >
    <div class="go-chart">
      <!--      顶栏    -->
      <n-layout>
        <layout-header-pro>
          <template #left>
            <!--            左侧三按钮 依次是选项栏 主栏 细节配置栏-->
            <header-left-btn></header-left-btn>
          </template>
          <template #center>
            <!--            输入新建布局的名字   -->
            <header-title></header-title>
          </template>
          <template #ri-left>
            <header-right-btn :parentMethod="childValueHandlingMethod"></header-right-btn>
          </template>
        </layout-header-pro>
        <!--        主操作区-->
        <n-layout-content content-style="overflow:hidden; display: flex">
          <div style="display: flex; overflow: hidden">
            <content-charts></content-charts>
            <content-layers></content-layers>
          </div>
          <content-configurations></content-configurations>
        </n-layout-content>
      </n-layout>
    </div>
    <!-- 右键 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      size="small"
      :x="mousePosition.x"
      :y="mousePosition.y"
      :options="menuOptions"
      :show="chartEditStore.rightMenuShow"
      :on-clickoutside="onClickOutSide"
      @select="handleMenuSelect"
    ></n-dropdown>
    <!-- 加载蒙层 -->
    <content-load></content-load>
  </el-drawer>
</template>
<script setup lang="ts" name="draggable">
import { nextTick, ref, UnwrapRef } from "vue";
import { User } from "@/api/interface";
import { DrawerProps } from "./index";
/**
 * 逻辑层  所有的组件都是异步加载的  因为本身都比较大
 * 所有的逻辑层才用hooks挂载传递 最终实现状态同步
 * 切勿乱动这个大模块里面的代码！！！
 */
// 异步加载组件
import { loadAsyncComponent } from "@/utils/components";
import { LayoutHeaderPro } from "@/layouts/components/charts/LayoutHeaderPro/index";
import { useContextMenu } from "./chart/hooks/useContextMenu.hook";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { ChartEditStoreEnum, EditCanvasConfigType } from "@/stores/modules/chartEditStore/chartEditStore.d";
import { ChartLayoutStoreEnum } from "@/stores/modules/chartLayoutStore/chartLayoutStore.d";
import { useChartHistoryStore } from "@/stores/modules/chartHistoryStore/chartHistoryStore";

// 顶栏的三个直接同步加载 防止卡到爆炸
import HeaderLeftBtn from "./chart/ContentHeader/headerLeftBtn/index.vue";
import HeaderTitle from "./chart/ContentHeader/headerTitle/index.vue";
import HeaderRightBtn from "./chart/ContentHeader/headerRightBtn/index.vue";
import { getDetailById } from "@/api/modules/player/diyLayout";
import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";
import { createComponent, fetchChartComponent, fetchConfigComponent } from "@/packages/index";
import { CreateComponentType, CreateComponentGroupType, ConfigType } from "@/packages/index.d";
import { getUUID } from "@/utils";
import merge from "lodash/merge";
import { useChartLayoutStore } from "@/stores/modules/chartLayoutStore/chartLayoutStore";
import { PublicGroupConfigClass } from "@/packages/public";
// 异步加载 组件  三个主要区域 同步会渲染性能不足  异步就会加载慢   折衷先用这个
// 主绘图区域
const ContentLayers = loadAsyncComponent(() => import("./chart/ContentLayers/index.vue"));
// 左侧的菜单栏
const ContentCharts = loadAsyncComponent(() => import("./chart/ContentCharts/index.vue"));
// 右侧的配置项
const ContentConfigurations = loadAsyncComponent(() => import("./chart/ContentConfigurations/index.vue"));
// 加载框
const ContentLoad = loadAsyncComponent(() => import("./chart/ContentLoad/index.vue"));
const chartEditStore = useChartEditStore();
const chartLayoutStore = useChartLayoutStore();
const chartHistoryStore = useChartHistoryStore();
/***
 * 父子交接
 */
const drawerVisible = ref(false); //是否显示

const drawerProps = ref<DrawerProps>({
  title: "",
  isAdd: true,
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  if (drawerProps.value.isAdd) {
    // 如果是新增走这里
    chartEditStore.id = null;
  } else {
    // 如果是编辑  走这里  1.组件库为空 2.id=  布局id
    chartEditStore.componentList = [];
    chartEditStore.id = drawerProps.value.row.layoutId;
    await handleData(drawerProps.value.row.layoutId as bigint);
  }
  drawerVisible.value = true;
};
// 处理id查到的数据
const handleData = (id: bigint) => {
  return new Promise(resolve => {
    getDetailById(id)
      .then((res: { data: { layoutDesign: string } }) => {
        let design = JSON.parse(res.data?.layoutDesign);
        nextTick().then(async () => {
          await updateComponent(design); //更新组件
          resolve(true);
        });

        // 手动硬更新  慎用！
        // setTimeout(() => {
        //   // chartEditStore.setAll(design.componentList, design.requestGlobalConfig, design.editCanvasConfig);
        //   nextTick(() => {
        //     for (let i in design.editCanvasConfig) {
        //       chartEditStore.setEditCanvasConfig(i as keyof EditCanvasConfigType, design.editCanvasConfig[i]);
        //     }
        //     design.componentList.forEach(item => {
        //       chartEditStore.addComponentList(item);
        //     });
        //     console.log(chartEditStore.componentList);
        //   });
        //
        //   // nextTick(() => {
        //   //   chartEditStore.setAll(design.componentList, design.requestGlobalConfig, design.editCanvasConfig);
        //   // });
        //   console.log(chartEditStore.editCanvasConfig);
        // }, 10000);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

// 提交
function handleSubmit() {
  drawerVisible.value = false;
}

// 右键
const { menuOptions, onClickOutSide, mousePosition, handleMenuSelect } = useContextMenu();
const flag = () => {
  return chartEditStore.rightMenuShow;
};

// 更新组件
const updateComponent = async (projectData, isReplace = true, changeId = false) => {
  if (isReplace) {
    // 清除列表
    chartEditStore.componentList = [];
  }
  // 列表组件注册
  projectData.componentList.forEach(async e => {
    const intComponent = target => {
      if (!window["$vue"].component(target.chartConfig.chartKey)) {
        window["$vue"].component(target.chartConfig.chartKey, fetchChartComponent(target.chartConfig));
        window["$vue"].component(target.chartConfig.conKey, fetchConfigComponent(target.chartConfig));
      }
    };
    intComponent(e);
  });

  // 创建函数-重新创建是为了处理类种方法消失的问题
  const create = async (_componentInstance: CreateComponentType, callBack?: (componentInstance: CreateComponentType) => void) => {
    // 补充 class 上的方法
    let newComponent: CreateComponentType = await createComponent(_componentInstance.chartConfig);
    if (_componentInstance.chartConfig.redirectComponent) {
      _componentInstance.chartConfig.dataset && (newComponent.option.dataset = _componentInstance.chartConfig.dataset);
      newComponent.chartConfig.title = _componentInstance.chartConfig.title;
      newComponent.chartConfig.chartFrame = _componentInstance.chartConfig.chartFrame;
    }
    if (callBack) {
      if (changeId) {
        callBack(componentMerge(newComponent, { ..._componentInstance, id: getUUID() }));
      } else {
        callBack(componentMerge(newComponent, _componentInstance));
      }
    } else {
      if (changeId) {
        chartEditStore.addComponentList(
          componentMerge(newComponent, {
            ..._componentInstance,
            id: getUUID()
          }),
          false,
          true
        );
      } else {
        chartEditStore.addComponentList(componentMerge(newComponent, _componentInstance), false, true);
      }
    }
  };

  // 数据赋值
  for (const key in projectData) {
    // 组件
    if (key === ChartEditStoreEnum.COMPONENT_LIST) {
      let loadIndex = 0;
      const listLength = projectData[key].length;
      for (const comItem of projectData[key]) {
        // 设置加载数量
        let percentage = parseInt((parseFloat(`${++loadIndex / listLength}`) * 100).toString());
        chartLayoutStore.setItemUnHandle(ChartLayoutStoreEnum.PERCENTAGE, percentage);
        // 判断类型
        if (comItem.isGroup) {
          // 创建分组
          let groupClass = new PublicGroupConfigClass();
          if (changeId) {
            groupClass = componentMerge(groupClass, { ...comItem, id: getUUID() });
          } else {
            groupClass = componentMerge(groupClass, comItem);
          }

          // 异步注册子应用
          const targetList: CreateComponentType[] = [];
          for (const groupItem of (comItem as CreateComponentGroupType).groupList) {
            await create(groupItem, e => {
              targetList.push(e);
            });
          }
          groupClass.groupList = targetList;

          // 分组插入到列表
          chartEditStore.addComponentList(groupClass, false, true);
        } else {
          await create(comItem as CreateComponentType);
        }
        if (percentage === 100) {
          // 清除历史记录
          chartHistoryStore.clearBackStack();
          chartHistoryStore.clearForwardStack();
        }
      }
    } else {
      // 非组件(顺便排除脏数据)
      if (key !== "editCanvasConfig" && key !== "requestGlobalConfig") return;
      componentMerge(chartEditStore[key], projectData[key], true);
    }
  }

  // 清除数量
  chartLayoutStore.setItemUnHandle(ChartLayoutStoreEnum.PERCENTAGE, 0);
};
// 记录初始化 历史记录
chartHistoryStore.canvasInit(chartEditStore.getEditCanvas);
const childValueHandlingMethod = () => {
  drawerVisible.value = false;
};
defineExpose({
  acceptParams
});

/**
 * * 合并处理
 * @param newObject 新的模板数据
 * @param sources 新拿到的数据
 * @returns object
 */
const componentMerge = (newObject: any, sources: any, notComponent = false) => {
  // 非组件不处理
  if (notComponent) return merge(newObject, sources);
  // 组件排除 newObject
  const option = sources.option;
  if (!option) return merge(newObject, sources);

  // 为 undefined 的 sources 来源对象属性将被跳过详见 https://www.lodashjs.com/docs/lodash.merge
  sources.option = undefined;
  if (option) {
    return {
      ...merge(newObject, sources),
      option: option
    };
  }
};
</script>

<style lang="scss" scoped>
@include go("chart") {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  @include background-image("background-image");
}
</style>
