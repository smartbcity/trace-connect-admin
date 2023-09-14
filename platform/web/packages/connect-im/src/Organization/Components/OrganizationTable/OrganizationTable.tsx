import { Typography } from '@mui/material'
import { MenuItem } from '@smartb/g2-components'
import { TableV2Props, TableV2 } from '@smartb/g2-layout'
import { Table as TableState } from '@tanstack/react-table'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import React from 'react'
import { Organization } from '../../Domain'
import { useTranslation } from 'react-i18next'

export interface OrganizationTableBasicProps<T extends Organization>
  extends BasicProps {
  /**
   * The state of the table
   */
  tableState: TableState<T>
  /**
   * The current page
   */
  page: number
  /**
   * The current page
   */
  setPage: (newPage: number) => void
  /**
   * The actions place on the top near the filters
   */
  tableActions?: React.ReactNode
  /**
   * Used for the pagination
   */
  totalPages?: number

  /**
   * The actions available on a organization
   */
  getActions?: (org: T) => MenuItem<{}>[]
  /**
   * The component to displauy if no user is found
   */
  noDataComponent?: JSX.Element
}

export type OrganizationTableProps<T extends Organization = Organization> =
  MergeMuiElementProps<
    Omit<TableV2Props<T>, 'columns' | 'data' | 'page' | 'onChangePage'>,
    OrganizationTableBasicProps<T>
  >

export const OrganizationTable = <T extends Organization = Organization>(
  props: OrganizationTableProps<T>
) => {
  const {
    tableState,
    getActions,
    page,
    setPage,
    tableActions,
    totalPages,
    noDataComponent,
    isLoading,
    ...other
  } = props
  const { t } = useTranslation()

  if (tableState.getTotalSize() === 0 && !isLoading)
    return (
      noDataComponent ?? (
        <Typography align='center'>{t('g2.noData')}</Typography>
      )
    )
  return (
    <TableV2<T>
      page={page}
      handlePageChange={setPage}
      tableState={tableState}
      totalPages={totalPages}
      variant='grounded'
      isLoading={isLoading}
      {...other}
    />
  )
}
