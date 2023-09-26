import { TableV2Props, TableV2 } from '@smartb/g2-layout'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { User } from '../../Domain'
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
    noDataComponent,
    isLoading,
    tableState,
    ...other
  } = props

  if (tableState.getTotalSize() === 0 && noDataComponent && !isLoading)
    return noDataComponent
  return (
    <TableV2<T>
      tableState={tableState}
      variant='grounded'
      isLoading={isLoading}
      {...other}
    />
  )
}
