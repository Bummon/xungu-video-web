import { ref, watch, computed } from "vue";
import { icon } from "@/plugins";
import { renderLang, renderIcon } from "@/utils";
import { themeColor, setItem, getCharts } from "./useLayout.hook";
import { PackagesEnum, PackagesCategoryName, ConfigType } from "@/packages/index.d";
import { usePackagesStore } from "@/stores/modules/packagesStore/packagesStore";
import { ChartLayoutStoreEnum } from "@/stores/modules/chartLayoutStore/chartLayoutStore.d";

// 图标库
const { AirPlaneOutlineIcon, ImageIcon, BarChartIcon, VideocamOutline } = icon.ionicons5;
const { TableSplitIcon, RoadmapIcon, SpellCheckIcon, GraphicalDataFlowIcon } = icon.carbon;

// 图表
export type MenuOptionsType = {
  key: string;
  icon: ReturnType<typeof renderIcon>;
  label: ReturnType<typeof renderLang>;
  list: ConfigType[];
};

// 一级目录的列表
const packagesListObj = {
  // 图表
  [PackagesEnum.CHARTS]: {
    icon: renderIcon(RoadmapIcon),
    label: PackagesCategoryName.CHARTS
  },
  // 信息
  [PackagesEnum.INFORMATIONS]: {
    icon: renderIcon(SpellCheckIcon),
    label: PackagesCategoryName.INFORMATIONS
  },
  // 表格
  [PackagesEnum.TABLES]: {
    icon: renderIcon(TableSplitIcon),
    label: PackagesCategoryName.TABLES
  },
  [PackagesEnum.DECORATES]: {
    icon: renderIcon(GraphicalDataFlowIcon),
    label: PackagesCategoryName.DECORATES
  },
  // 图片
  [PackagesEnum.PHOTOS]: {
    icon: renderIcon(ImageIcon),
    label: PackagesCategoryName.PHOTOS
  },
  // 图标
  [PackagesEnum.ICONS]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.ICONS
  },
  // 多媒体
  [PackagesEnum.MEDIAS]: {
    icon: renderIcon(VideocamOutline),
    label: PackagesCategoryName.MEDIAS
  }
};

export const useAsideHook = () => {
  const packagesStore = usePackagesStore();
  // 菜单列表
  const menuOptions: MenuOptionsType[] = [];

  // 处理列表
  const handlePackagesList = () => {
    for (const val in packagesStore.getPackagesList) {
      menuOptions.push({
        key: val,
        // @ts-expect-error
        icon: packagesListObj[val].icon, // 报错无法读取undefined
        // @ts-expect-error
        label: packagesListObj[val].label,
        // @ts-expect-error
        list: packagesStore.getPackagesList[val]
      });
    }
  };
  handlePackagesList();

  // 记录选中值
  let beforeSelect: string = menuOptions[0]["key"];
  const selectValue = ref<string>(menuOptions[0]["key"]);

  // 选中的对象值 选中对象后展示对象的列表
  const selectOptions = ref(menuOptions[0]);

  // 点击 item
  const clickItemHandle = (key: string, item: any) => {
    selectOptions.value = item;
    // 处理折叠
    if (beforeSelect === key) {
      setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value, false);
    } else {
      setItem(ChartLayoutStoreEnum.CHARTS, true, false);
    }
    beforeSelect = key;
  };

  return {
    getCharts,
    BarChartIcon,
    themeColor,
    selectOptions,
    selectValue,
    clickItemHandle,
    menuOptions
  };
};
