import { Option } from "@smartb/g2"
//to remove when added in g2

export interface GetOptionsOfStatusValuesParams {
    statusValues: Record<string, () => any>
    getLabel: (value: string) => string
    getColor?: (value: string) => string
    /**
    * @default true
    */
    usePrototype?: boolean
    /**
    * @default false
    */
    noCheckIncludes?: boolean
    /**
     * @default () => true
     */
    filterValue?: (value: string) => boolean
    /**
     * Inform that the label is an object like this: `{value: string}`
     * @default false
     */
    labelIsBackendTyped?: boolean
  }

export const getOptionsOfStatusValues = (
    params: GetOptionsOfStatusValuesParams
  ): Option[] => {
    const {
      statusValues,
      getLabel,
      getColor,
      usePrototype = true,
      noCheckIncludes = false,
      filterValue = () => true,
      labelIsBackendTyped = false
    } = params
  
    return Object.values(
      usePrototype
        ? Object.getPrototypeOf(statusValues) as Record<string, () => any>
        : statusValues
    ).map(getValue => {
      const value = labelIsBackendTyped ? getValue().value : getValue()
      return {
        key: value,
        label: getLabel(value),
        color: getColor ? getColor(value) : undefined
      }
    }).filter(status => {
      return typeof status.key === "string"
        && !!status.label
        && (noCheckIncludes || !status.label.includes(status.key))
        && filterValue(status.key)
    })
  }