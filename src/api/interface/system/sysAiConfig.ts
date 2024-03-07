export namespace sysAiConfig {
  export interface AiConfig {
    aiId: number | bigint;
    apiName: string;
    apiKey: string;
    secretKey: string;
    enabled: number;
    remark?: string;
    createUserId?: number | bigint;
    createUsername?: string;
    createTime?: string;
    modifyUserId?: number | bigint;
    modifyUsername?: string;
    modifyTime?: string;
  }
}
