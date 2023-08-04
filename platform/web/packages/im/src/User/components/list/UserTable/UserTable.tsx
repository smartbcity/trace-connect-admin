import { User } from '@smartb/g2-i2-v2'
import { TableV2Props, TableV2 } from '@smartb/g2-layout'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { Table as TableState } from '@tanstack/react-table'

export interface UserTableBasicProps<T extends User> extends BasicProps {
  /**
   * The state of the table
   */
  tableState: TableState<T>
  /**
   * Used for the pagination
   */
  totalPages?: number
  /**
   * The current page
   */
  page: number
  /**
   * The current page
   */
  setPage: (newPage: number) => void
  /**
   * The component to displauy if no user is found
   */
  noDataComponent?: JSX.Element
}

export type UserTableProps<T extends User = User> = MergeMuiElementProps<
  Omit<TableV2Props<T>, 'columns' | 'data' | 'page' | 'onChangePage'>,
  UserTableBasicProps<T>
>

export const UserTable = <T extends User = User>(props: UserTableProps<T>) => {
  const {
    totalPages,
    page,
    setPage,
    noDataComponent,
    isLoading,
    tableState,
    ...other
  } = props

  if (tableState.getTotalSize() === 0 && noDataComponent && !isLoading)
    return noDataComponent
  return (
    <TableV2<T>
      page={page}
      tableState={tableState}
      handlePageChange={setPage}
      totalPages={totalPages}
      variant='grounded'
      isLoading={isLoading}
      {...other}
    />
  )
}
