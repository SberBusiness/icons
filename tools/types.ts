export type DeepPartial<T> = T extends object
    ? {
          [K in keyof T]?: DeepPartial<T[K]>;
      }
    : T;

export interface ITokenizedIconName {
    type: string;
    category: string;
    name: string;
    state: string;
    size: string;
    theme: string;
    channel: string;
}

export interface ITokenizedIcon extends ITokenizedIconName {
    componentName: string;
    srcName: string;
}
