import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { OrganizationTable, OrganizationTableProps } from './OrganizationTable'
import { useGetOrganizations } from '../../Api'
import { Organization, OrganizationId } from '../../Domain'
import {
  useOrganizationTableState,
  useOrganizationTableStateParams
} from './useOrganizationTableState'
import { QueryOptions } from '@smartb/g2-utils'

export interface AutomatedOrganizationTableBasicProps<T extends Organization>
  extends BasicProps {
  /**
   * The getOrganizations hook options
   */
  getOrganizationsOptions?: QueryOptions<{id: OrganizationId}, {items: T[], total: number}>
  /**
   * Pass the current state of the filters
   */
  filters?: any
  /**
   * the table state params
   */
  tableStateParams?: Partial<useOrganizationTableStateParams<T>>
}

export type AutomatedOrganizationTableProps<
  T extends Organization = Organization
> = MergeMuiElementProps<
  Omit<
    OrganizationTableProps<T> & useOrganizationTableStateParams<T>,
    | 'organizations'
    | 'onFetchOrganizations'
    | 'totalPages'
    | 'page'
    | 'setPage'
    | 'tableState'
  >,
  AutomatedOrganizationTableBasicProps<T>
>

export const AutomatedOrganizationTable = <
  T extends Organization = Organization
>(
  props: AutomatedOrganizationTableProps<T>
) => {
  const {
    filters,
    getOrganizationsOptions,
    tableStateParams,
    ...other
  } = props

  const getOrganizations = useGetOrganizations<T>({
    query: filters,
    options: getOrganizationsOptions
  })

  const tableState = useOrganizationTableState<T>({
    organizations: getOrganizations.data?.items ?? [],
    ...tableStateParams
  })

  return (
    <OrganizationTable<T>
      isLoading={!getOrganizations.isSuccess}
      tableState={tableState}
      {...other}
    />
  )
}
