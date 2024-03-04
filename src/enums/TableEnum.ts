// 这是表格的列宽度统一样式

/**
 * @enum {number}
 * @author 党亚南-20230712
 * @description 统一表格的列宽风格
 * @property { 220 } Name 普通名称 作为主名称
 * @property { 40 } Select 勾选框
 * @property { 200 } Parent 从属于父的名称 比如房间属于区域
 * @property { 140 } PersonName 适用于人名 3-4个字
 * @property { 70 } SingleString 适用1-2个字
 * @property { 50 } Index  适用于序号
 * @property { 90 } Status 适用于状态
 * @property { 120 } Type 适用于类型 Key值等
 * @property { 140 } BigIntNum 适用于bigInt等 包括手机号，工号  各种唯一识别号
 * @property { 200 } Email Email专用
 * @property { 180 } LongTime 日期 修改日期 创建日期
 * @property {200} Handle2 适用操作栏2个按钮
 * @property {280} Handle3 适用操作栏3个按钮
 * @property {350} Handle4 适用操作栏4个按钮
 */
export enum TableWidthEnum {
  Select = 40, // 可选框
  Sort = 90,
  Name = 200, // 普通名称
  Parent = 200, // 父级名  统一定
  PersonName = 130, // 用于短一点的名称 一般就是人名
  SingleString = 70, // 更短  1到2个字的数据
  Index = 60, // 序号
  Status = 90, // 状态 可切换
  Type = 110, // 作为描述类型的 Key值  类型值
  BigIntNum = 140, // bigint数字  包括手机号，工号  各种唯一识别号
  ShortNum = 90, //短数字  保持标题四个字也能全显示
  LongTime = 175, // 带日期的时间数据
  Email = 200,
  // 操作栏 两按钮 三按钮 四按钮    如果当前页面没有自适应列  则不写width 让操作列作为自适应
  Handle2 = 200,
  Handle3 = 250,
  Handle4 = 350,
  Handle5 = 450
}

/**
 * @enum {string}
 * @author 党亚南-20230712
 * @description 统一表格的表头称呼风格
 * @property { string } Index  No
 * @property { string } Status 状态
 * @property { string } Type 类型
 * @property { string } Sort 排序
 * @property { string } Descr 描述
 * @property { string } ModifyTime  修改时间
 * @property { string } Operation 操作
 * @property { string } Attachment 附件
 * @property { string } Open 启用
 */
export enum TableLabelEnum {
  Index = "No",
  Type = "类型",
  Sort = "排位顺序",
  Descr = "描述",
  Status = "状态",
  Operation = "操作",
  ModifyTime = "修改时间",
  Open = "启用",
  Attachment = "附件"
}

export const TableStatusOptions = [
  { label: "启用", value: 1 },
  { label: "停用", value: 0 }
];

export const TableSourceTypeOptions = [
  { label: "音频处理器", value: 6222108386629 },
  { label: "摄像机", value: 6223295141573 },
  { label: "时序电源", value: 6222105722437 },
  { label: "视频会议终端", value: 6256713292997 },
  { label: "会议录播主机", value: 6222106965317 },
  { label: "矩阵", value: 6222102838213 }
];

export const TableRunningStatusEnums = [
  { label: "在线", value: 1 },
  { label: "离线", value: 2 },
  { label: "故障", value: 0 }
];

export const TableAlarmLevelOptions = [
  { label: "提示", value: "提示" },
  { label: "一般", value: "一般" },
  { label: "重要", value: "重要" },
  { label: "紧急", value: "紧急" }
];
