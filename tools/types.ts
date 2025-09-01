export type DeepPartial<T> = T extends object
    ? {
          [K in keyof T]?: DeepPartial<T[K]>;
      }
    : T;

export interface ITokenizedIconName {
    type: string,
    category: string;
    name: string;
    size: string;
    state?: string;
    theme?: string;
    style?: string;
}

export interface ITokenizedIcon extends ITokenizedIconName {
    componentName: string;
    srcName: string;
}
