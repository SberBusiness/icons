export interface ITokenizedIconName {
    type: string,
    category: string,
    name: string,
    state: string,
    size: string,
    channel: string,
}

export interface ITokenizedIcon extends ITokenizedIconName {
    componentName: string,
    srcName: string,
}
