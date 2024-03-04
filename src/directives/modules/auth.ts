/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from "@/stores/modules/auth";
import type { Directive, DirectiveBinding } from "vue";

// const auth: Directive = {
//   mounted(el: HTMLElement, binding: DirectiveBinding) {
//     const authStore = useAuthStore();
//     // const { routeName, authButtonListGet } = authStore;
//     const code = binding.value.includes("-text");
//     if (code) {
//       binding.value = binding.value.split("-")[0];
//       const res = authButtonListGet.includes(routeName + binding.value);
//       if (res) {
//         el.style.display = "none";
//       }
//       return;
//     }
//     const permission = routeName + binding.value;
//     const hasPermission = authButtonListGet.includes(permission);
//     if (!hasPermission) {
//       el.style.display = "none";
//     }
//   }
// };
const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const authStore = useAuthStore();

    if (!authStore.authButtonListGet.includes(value)) {
      el.remove();
    }
    // const currentPageRoles = authStore.authButtonListGet[authStore.routeName] ?? [];
    // if (value instanceof Array && value.length) {
    //   const hasPermission = value.every(item => currentPageRoles.includes(item));
    //   if (!hasPermission) el.remove();
    // } else {
    //   if (!currentPageRoles.includes(value)) el.remove();
    // }
  }
};
export default auth;
