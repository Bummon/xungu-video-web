import { useAuthStore } from "@/stores/modules/auth";
import { storeToRefs } from "pinia";

export class AuthUtils {
  static hasPermission = (auth: string): boolean => {
    const authStore = useAuthStore();
    const { authButtonList } = storeToRefs(authStore);
    const buttons: string[] = Object.values(authButtonList.value).flat();
    return buttons.includes(auth);
  };
}
