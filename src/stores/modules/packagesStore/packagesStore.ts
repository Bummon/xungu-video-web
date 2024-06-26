import { defineStore } from "pinia";
import { ConfigType, PackagesStoreType, PackagesType } from "./packagesStore.d";
import { packagesList } from "@/packages/index";
import { StorageEnum } from "@/enums/storageEnum";
import { getLocalStorage, setLocalStorage } from "@/utils";

// 组件 packages
export const usePackagesStore = defineStore({
  id: "usePackagesStore",
  state: (): PackagesStoreType => ({
    // Object.freeze() 方法用于冻结对象，禁止对于该对象的属性进行修改（由于数组本质也是对象，因此该方法可以对数组使用）。
    packagesList: Object.freeze(packagesList),
    newPhoto: undefined
  }),
  getters: {
    getPackagesList(): PackagesType {
      return this.packagesList;
    }
  },
  actions: {
    addPhotos(newPhoto: ConfigType, index: number) {
      this.newPhoto = newPhoto;
      this.packagesList.Photos.splice(index, 0, newPhoto);
    },
    deletePhotos(photoInfo: ConfigType, index: number) {
      this.packagesList.Photos.splice(index, 1);
      const StoreKey = StorageEnum.GO_USER_MEDIA_PHOTOS;
      const userPhotosList = getLocalStorage(StoreKey);
      userPhotosList.splice(index - 1, 1);
      setLocalStorage(StoreKey, userPhotosList);
    }
  }
});
