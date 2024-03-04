import { MeetSourceType } from "@/api/interface/source";
import { BrandHttp } from "@/api/modules/source/brand";
import { DataType } from "@/api/modules/data";
export class CommandHandle {
  /**
   * 获取型号的列表
   * @description 在这里进行清洗 将数据转换成符合级联选择器的数据
   */

  static getModelList(): Promise<DataType.Cascade[] | []> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] | [] = [];
        let brandList: MeetSourceType.brand[] = (await BrandHttp.getBrand()).data;
        let modelList = (await BrandHttp.getModel({})).data;
        brandList.forEach(brand => {
          let tmp: DataType.Cascade = {
            label: brand.brandName,
            value: brand.brandId,
            children: []
          };
          modelList.forEach((model: MeetSourceType.model) => {
            if (model.brandId === brand.brandId) {
              tmp.children.push({ label: model.modelName, value: model.modelId });
            }
          });
          if (tmp.children?.length > 0) {
            data.push(tmp);
          }
        });
        resolve(data);
      } catch (e) {
        reject([]);
      }
    });
  }
}
