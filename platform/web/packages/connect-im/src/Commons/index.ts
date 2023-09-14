export * from './model'
export * from './useAdressFields'

export const mergeFields = <T = any>(field: T, override?: Partial<T>): T => {
  return {
    ...field,
    ...override,
    params: {
      //@ts-ignore
      ...field.params,
      //@ts-ignore
      ...override?.params
    }
  }
}
