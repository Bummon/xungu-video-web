<template>
  <div class="">
    <el-table :data="tableData" border>
      <!-- 动态生成表格列 -->
      <el-table-column
        v-for="(column, columnIndex) in tableColumns"
        :key="columnIndex"
        :type="column.type"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { RoomHttp } from "@/api/modules/control/meetRoom";
import { TableWidthEnum } from "@/enums/TableEnum";

export default defineComponent({
  setup() {
    const tableData = ref([]); // 表格数据
    const tableColumns = ref([]); // 表格列配置
    const total = ref(0); // 数据总数

    onMounted(() => {
      fetchData();
    });

    // 发送请求获取服务器数据
    const fetchData = async () => {
      try {
        const response = await RoomHttp.getCountRoomsBySourceType();
        const { contents, header } = response.data;

        // 列的固定部分
        const fixedColumns = [
          { prop: "会议室ID", label: "会议室ID", width: TableWidthEnum.Name },
          { prop: "会议室名称", label: "会议室名称", width: TableWidthEnum.Name },
          { prop: "设备总数", label: "设备总数", width: TableWidthEnum.Sort }
        ];

        // 动态添加剩余列
        const dynamicColumns = header
          .filter(item => !["会议室名称", "会议室ID", "设备总数"].includes(item))
          .map(item => ({ prop: item, label: item }));

        // 更新表格列配置和数据
        tableColumns.value = [...fixedColumns, ...dynamicColumns];
        tableData.value = contents;
      } catch (error) {
        console.error("获取数据失败", error);
      }
    };

    return {
      tableData,
      tableColumns,
      total
    };
  }
});
</script>
