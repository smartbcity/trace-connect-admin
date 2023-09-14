import { Organization } from '../../Domain'
import { UseTableOptions, useTable, G2ColumnDef } from '@smartb/g2-layout'
import {
  useOrganizationColumns,
  useOrganizationColumnsParams
} from './useOrganizationColumns'

export interface useOrganizationTableStateParams<T extends Organization>
  extends Partial<UseTableOptions<T>>,
    useOrganizationColumnsParams<T> {
  /**
   * The columns
   */
  columns?: G2ColumnDef<T>[]
  /**
   * The data of the tableState returned by the useTable
   */
  organizations: T[]
}

export const useOrganizationTableState = <
  T extends Organization = Organization
>(
  params?: useOrganizationTableStateParams<T>
) => {
  const { columns, organizations = [], getActions, ...other } = params ?? {}

  const base = useOrganizationColumns({
    getActions
  })

  return useTable({
    data: organizations,
    columns: columns ?? base.columnsArray,
    getRowId: (row) => row.id,
    ...other
  })
}
