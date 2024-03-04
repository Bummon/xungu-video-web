// 把一些方法拆到这里
import { BrandHttp } from "@/api/modules/source/brand";
import { ResultData } from "@/api/interface";
import { MeetSourceType } from "@/api/interface/source";

export class BrandHandle {
  /**
   * 获取品牌列表并过滤掉已经被停用的数据
   */
  static getBrandList(): Promise<MeetSourceType.brand[] | []> {
    return new Promise((resolve, reject) => {
      BrandHttp.getBrand()
        .then((res: ResultData<MeetSourceType.brand[]>) => {
          if (res.data.constructor === Array) {
            let data: MeetSourceType.brand[] = res.data.filter(item => item.brandStatus !== 0);
            resolve(data);
          } else {
            reject([]);
          }
        })
        .catch(() => {
          reject([]);
        });
    });
  }
}
