export namespace sysConfig {
  export interface Config {
    configId: number | bigint;
    systemName: string;
    systemLogo: string;
    modifyUserId?: number | bigint;
    modifyUsername?: string;
    modifyTime?: string;
  }
}
