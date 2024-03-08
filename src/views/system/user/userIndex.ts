import { DataType } from "@/api/modules/data";
import { getDeptList } from "@/api/modules/base/dept";
import { sysDept } from "@/api/interface/base/sysDept";

export class UserDeptHandle {
  static getDeptList(): Promise<[] | DataType.Cascade[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: DataType.Cascade[] | [] = [];
        // 父部门
        let parentList = (await getDeptList({ parentId: 0, enabled: 1 })).data;
        // 子部门
        let childList = (await getDeptList({ parentId: 1, enabled: 1 })).data;

        parentList.forEach(parentDept => {
          let tmp: DataType.Cascade = {
            label: parentDept.deptName,
            value: parentDept.deptId,
            children: []
          };
          childList.forEach((childDept: sysDept.Dept) => {
            if (childDept.parentId === parentDept.deptId) {
              tmp.children.push({ label: childDept.deptName, value: childDept.deptId });
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
