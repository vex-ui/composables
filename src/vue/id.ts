let id = 0
export const useID = (namespace?: string) => `vex${namespace ? `-${namespace}` : ''}:${id++}`
