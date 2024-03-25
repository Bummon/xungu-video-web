import { DataType } from "@/api/modules/data";
import { getDeptList } from "@/api/modules/base/dept";
import { sysDept } from "@/api/interface/base/sysDept";

export class UserDeptHandle {
  static getDeptList(): Promise<[] | DataType.Cascade[]> {
    function getChildren(parentId: number, deptList: sysDept.Dept[]): DataType.Cascade[] {
      let children: DataType.Cascade[] = [];
      deptList.forEach((dept: sysDept.Dept) => {
        if (dept.parentId === parentId) {
          children.push({
            label: dept.deptName,
            value: dept.deptId,
            children: getChildren(dept.deptId, deptList) // 递归调用以构建子部门
          });
          //console.log(children);
        }
      });
      return children;
    }

    return new Promise(async (resolve, reject) => {
      try {
        let deptList = (await getDeptList({ enabled: 1 })).data;
        let data: DataType.Cascade[] | [] = getChildren(0, deptList);
        console.log(data);
        resolve(data);
      } catch (e) {
        reject([]);
      }
    });
  }
}
