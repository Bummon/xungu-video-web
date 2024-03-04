// import { ChartList } from "@/packages/components/Charts/index";
// import { TableList } from "@/packages/components/Tables/index";
import { DecorateList } from "@/packages/components/Decorates/index";
import { InformationList } from "@/packages/components/Informations/index";
import { PhotoList } from "@/packages/components/Photos/index"; // 图片项
import { MediaList } from "@/packages/components/Medias/index";
import { PackagesEnum, PackagesType, ConfigType, FetchComFlagType } from "@/packages/index.d";
import { useChartEditStore } from "@/stores/modules/chartEditStore/chartEditStore";
const chartEditStore = useChartEditStore();
const configModules: Record<string, { default: string }> = import.meta.glob("./components/**/config.vue", {
  eager: true
});
const indexModules: Record<string, { default: string }> = import.meta.glob("./components/**/index.vue", {
  eager: true
});
const imagesModules: Record<string, { default: string }> = import.meta.glob("../assets/images/chart/**", {
  eager: true
});

// * 所有图表   这里是实际存储 所有组件的位置
export let packagesList: PackagesType = {
  [PackagesEnum.MEDIAS]: MediaList, // 多媒体
  [PackagesEnum.INFORMATIONS]: InformationList, // 信息
  [PackagesEnum.DECORATES]: DecorateList,
  [PackagesEnum.PHOTOS]: PhotoList // 图片
};

/**
 * * 获取目标组件配置信息
 * @param targetData
 */
export const createComponent = async (targetData: ConfigType) => {
  const { redirectComponent, category, key } = targetData;

  // redirectComponent 是给图片组件库和图标组件库使用的
  if (redirectComponent) {
    const [packageName, categoryName, keyName] = redirectComponent.split("/");
    const redirectChart = await import(`./components/${packageName}/${categoryName}/${keyName}/config.ts`);
    return new redirectChart.default();
  }
  const chart = await import(`./components/${targetData.package}/${category}/${key}/config.ts`);
  return new chart.default();
};

/**
 * * 获取组件
 * @param {string} chartName 名称
 * @param {FetchComFlagType} flag 标识 0为展示组件, 1为配置组件
 */
const fetchComponent = (chartName: string, flag: FetchComFlagType) => {
  const module = flag === FetchComFlagType.VIEW ? indexModules : configModules;
  for (const key in module) {
    const urlSplit = key.split("/");
    if (urlSplit[urlSplit.length - 2] === chartName) {
      return module[key];
    }
  }
};

/**
 * * 获取展示组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchChartComponent = (dropData: ConfigType) => {
  const { key } = dropData;
  return fetchComponent(key, FetchComFlagType.VIEW)?.default;
};

/**
 * * 获取配置组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchConfigComponent = (dropData: ConfigType) => {
  const { key } = dropData;
  return fetchComponent(key, FetchComFlagType.CONFIG)?.default;
};

/**
 * * 获取图片内容  根据item的内容获取图片
 * @param {ConfigType} targetData 配置项
 */
export const fetchImages = async (targetData?: ConfigType) => {
  if (!targetData) return "";
  // 正则判断图片是否为 url，是则直接返回该 url
  if (/^(http|https):\/\/([\w.]+\/?)\S*/.test(targetData.image)) return targetData.image;
  // 新数据动态处理
  const { image, package: targetDataPackage } = targetData;
  // 兼容旧数据
  if (image.includes("@") || image.includes("base64")) return image;
  const imageName = image.substring(image.lastIndexOf("/") + 1);

  for (const key in imagesModules) {
    const urlSplit = key.split("/");
    if (urlSplit[urlSplit.length - 1] === imageName) {
      return imagesModules[key]?.default;
    }
  }
  return "";
};

export const removeComponent = () => {
  console.log(chartEditStore.componentList);
  // chartEditStore.removeComponentList([id]);
};
