import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { useState } from 'react'
import { UserTable, UserTableProps } from './UserTable'
import { useGetUsers } from '../../Api'
import { User } from '../../Domain'
import { useUserTableState, useUserTableStateParams } from './useUserTableState'
import { QueryOptions } from '@smartb/g2-utils'

// TODO Automated should be without getUsers and organizationsRefs
// we could use a parameter to disable organizationsRefs if needed
// jwt should be get by useAuth
// apiUrl should be a configuration out side of the components
export interface AutomatedUserTableBasicProps<T extends User = User>
  extends BasicProps {
  /**
   * The getUsers hook options
   */
  getUsersOptions?: QueryOptions<{id: string}, {items: T[], total: number}>
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
  tableStateParams?: Partial<useUserTableStateParams<T>>
}

export type AutomatedUserTableProps<T extends User = User> =
  MergeMuiElementProps<
    Omit<
      UserTableProps<T> & useUserTableStateParams<T>,
      | 'users'
      | 'onFiltersChanged'
      | 'totalPages'
      | 'page'
      | 'setPage'
      | 'tableState'
    >,
    AutomatedUserTableBasicProps<T>
  >

export const AutomatedUserTable = <T extends User = User>(
  props: AutomatedUserTableProps<T>
) => {
  const {
    filters,
    getUsersOptions,
    page,
    setPage,
    tableStateParams,
    getOrganizationUrl,
    hasOrganizations,
    ...other
  } = props

  const [localPage, localSetPage] = useState<number>(1)

  const getUsers = useGetUsers<T>({
    query: {
      page: localPage - 1,
      ...filters
    },
    options: getUsersOptions
  })

  const total = Math.ceil((getUsers.data?.total ?? 0) / 10)

  const tableState = useUserTableState<T>({
    users: getUsers.data?.items ?? [],
    getOrganizationUrl,
    hasOrganizations,
    ...tableStateParams
  })

  return (
    <UserTable<T>
      page={page ?? localPage}
      setPage={setPage ?? localSetPage}
      isLoading={!getUsers.isSuccess}
      tableState={tableState}
      totalPages={
        total && total > 1
          ? total
          : undefined
      }
      {...other}
    />
  )
}
