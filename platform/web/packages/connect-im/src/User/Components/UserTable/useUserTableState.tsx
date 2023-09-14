import { G2ColumnDef, UseTableOptions, useTable } from '@smartb/g2-layout'
import { User } from '../../Domain'
import { useUserColumns, useUserColumnsParams } from './useUserColumns'

export interface useUserTableStateParams<T extends User>
  extends Partial<UseTableOptions<T>>,
    useUserColumnsParams<T> {
  /**
   * The columns
   */
  columns?: G2ColumnDef<T>[]
  /**
   * The user to pe parsed in the table
   */
  users: T[]
}

export const useUserTableState = <T extends User = User>(
  params?: useUserTableStateParams<T>
) => {
  const {
    columns,
    users = [],
    getOrganizationUrl,
    hasOrganizations = false,
    getActions,
    ...other
  } = params ?? {}

  const base = useUserColumns({
    getOrganizationUrl,
    hasOrganizations,
    users,
    getActions
  })

  return useTable({
    data: users,
    columns: columns ?? base.columnsArray,
    getRowId: (row) => row.id,
    ...other
  })
}
