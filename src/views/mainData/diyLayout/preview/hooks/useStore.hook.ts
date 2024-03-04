import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
import { ChartEditStoreEnum } from "@/stores/modules/chartEditStore/chartEditStore.d.ts";
import type { ChartEditStorageType } from "../index";

// store 相关
export const useStore = (localStorageInfo: ChartEditStorageType) => {
  const chartEditStore = useChartEditStore();
  chartEditStore.requestGlobalConfig = localStorageInfo[ChartEditStoreEnum.REQUEST_GLOBAL_CONFIG];
};
