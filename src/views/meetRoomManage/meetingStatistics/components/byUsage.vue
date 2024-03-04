<template>
  <div class="">
    <div class="" style="margin: 0 0 1vh">
      <el-button @click="selectTime('day')" dark :color="active === 1 ? primaryColor : ''">当日</el-button>
      <el-button @click="selectTime('week')" dark :color="active === 2 ? primaryColor : ''">近一周</el-button>
      <el-button @click="selectTime('month')" dark :color="active === 3 ? primaryColor : ''"> 近三十天</el-button>
    </div>
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

const getDate = () => {
  // 获取当前日期
  const currentDate = new Date();

  // 格式化当前日期为 "YYYY-MM-DD"
  const formattedCurrentDate = currentDate
    .toLocaleDateString("zh", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");

  console.log("当天日期:", formattedCurrentDate);

  // 计算七天前的日期
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  // 格式化七天前的日期为 "YYYY-MM-DD"
  const formattedSevenDaysAgo = sevenDaysAgo
    .toLocaleDateString("zh", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");

  console.log("七天前日期:", formattedSevenDaysAgo);

  // 计算一个月前的日期
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  // 格式化一个月前的日期为 "YYYY-MM-DD"
  const formattedOneMonthAgo = oneMonthAgo
    .toLocaleDateString("zh", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");

  console.log("一个月前日期:", formattedOneMonthAgo);
  return [formattedCurrentDate, formattedSevenDaysAgo, formattedOneMonthAgo];
};
export default defineComponent({
  setup() {
    // 获取根文档样式表
    const rootStyles = getComputedStyle(document.documentElement);
    // 获取 --el-color-primary 的值
    const primaryColor = rootStyles.getPropertyValue("--el-color-primary");
    const tableData = ref([]); // 表格数据
    const tableColumns = ref([]); // 表格列配置
    const total = ref(0); // 数据总数
    const active = ref(1);
    // 获取日期
    let dates = getDate();
    onMounted(() => {
      fetchData(dates[0], dates[0]);
    });

    const selectTime = async (format = "day") => {
      let startTime = dates[0];
      switch (format) {
        case "week":
          startTime = dates[1];
          active.value = 2;
          break;
        case "month":
          active.value = 3;
          startTime = dates[2];
          break;
        case "day":
        default:
          active.value = 1;
          break;
      }
      await fetchData(startTime, dates[0]);
    };
    // 发送请求获取服务器数据
    const fetchData = async (startTime, endTime) => {
      try {
        tableData.value = (await RoomHttp.getBookCount({ start: startTime, end: endTime })).data;
        // 列的固定部分
        const fixedColumns = [
          { type: "index", label: "排名", width: TableWidthEnum.Sort },
          { prop: "roomId", label: "会议室ID", width: TableWidthEnum.BigIntNum },
          { prop: "roomName", label: "会议室名称", width: TableWidthEnum.Name },
          { prop: "bookNum", label: "预约次数", width: TableWidthEnum.Name }
        ];
        tableColumns.value = [...fixedColumns];
      } catch (error) {
        console.error("获取数据失败", error);
      }
    };

    return {
      tableData,
      tableColumns,
      total,
      selectTime,
      active,
      primaryColor
    };
  }
});
</script>
