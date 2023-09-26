import { MergeMuiElementProps, TableV2, TableV2Props } from "@smartb/g2";
import { OffsetPagination, PageQueryResult } from "./model";
import { FixedPagination } from "./FixedPagination";

export type OffsetTableBasicProps<DATA extends {}> = {
  page?: PageQueryResult<DATA>
  pagination: OffsetPagination
  onOffsetChange?: (newPage: OffsetPagination) => void
}

export type OffsetTableProps<DATA extends {}> = MergeMuiElementProps<
  Omit<TableV2Props<DATA>, 'page' | 'totalPages' | 'handlePageChange'>,
  OffsetTableBasicProps<DATA>
>

export const OffsetTable = <Data extends {}>(props: OffsetTableProps<Data>) => {
  const { pagination, page, onOffsetChange, isLoading, ...other } = props
  

  return (
    <>
      <TableV2
        isLoading={isLoading}
        {...other}
      />
     <FixedPagination pagination={pagination} page={page} isLoading={isLoading} onOffsetChange={onOffsetChange} />
    </>
  )
}