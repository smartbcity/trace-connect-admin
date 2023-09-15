import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { useState } from 'react'
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
   * Override the default local page state
   */
  page?: number
  /**
   * the event called when the page changes
   */
  setPage?: (newPage: number) => void
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
    page,
    setPage,
    tableStateParams,
    ...other
  } = props

  const [localPage, localSetPage] = useState<number>(1)

  const getOrganizations = useGetOrganizations<T>({
    query: {
      page: localPage - 1,
      ...filters
    },
    options: getOrganizationsOptions
  })

  const total = getOrganizations.data?.total ? Math.ceil(getOrganizations.data?.total / 10) : 0

  const tableState = useOrganizationTableState<T>({
    organizations: getOrganizations.data?.items ?? [],
    ...tableStateParams
  })

  return (
    <OrganizationTable<T>
      isLoading={!getOrganizations.isSuccess}
      tableState={tableState}
      totalPages={
        total && total > 1
          ? total
          : undefined
      }
      page={page ?? localPage}
      setPage={setPage ?? localSetPage}
      {...other}
    />
  )
}
