export namespace sysAiConfig {
  export interface AiConfig {
    aiId: number | bigint;
    apiName: string;
    apiKey: string;
    secretKey: string;
    identifier: string;
    expireTime: number | bigint;
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
