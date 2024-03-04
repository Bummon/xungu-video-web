import { ref, toRefs } from "vue";

// 布局
import { useChartLayoutStore } from "@/stores/modules/chartLayoutStore/chartLayoutStore";
// 样式
import { useDesignStore } from "@/stores/modules/designStore/designStore";

// 全局颜色
const designStore = useDesignStore();
const themeColor = ref(designStore.getAppTheme);

// 结构控制
const { setItem } = useChartLayoutStore();
const { getCharts } = toRefs(useChartLayoutStore());

export { themeColor, setItem, getCharts };
