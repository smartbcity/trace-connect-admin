import {useMemo} from "react";
import {ColumnFactory, Table, TableV2, useTable} from "@smartb/g2";
import {TableCellAdmin} from "components";
import {useTranslation} from "react-i18next";
import {Box, Typography} from "@mui/material";
import {PageQueryResult} from "template";

export interface APIKey {
    name : string
    identifier :  string
    created : number
}


function useAPIKeyColumn() {
    const { t } = useTranslation();
    return useMemo(() => ColumnFactory<APIKey>({
        generateColumns: (generators) => ({
            name: generators.text({
                header: t("name"),
                getCellProps: (registry) => ({
                    value: registry.name
                })
            }),

            identifier: generators.text({
                header: t("identifier"),
                getCellProps: (registry) => ({
                    value: registry.name
                })
            }),

            date: generators.date({
                header: t("created"),
                getCellProps: (registry) => ({
                    date: registry.created
                })
            }),
            // @ts-ignore
            action : {
                cell: ({}) => (
                    <TableCellAdmin />
                )
            }


        })
    }), [t]);
}

export interface APIKeysTableProps{
    page?: PageQueryResult<APIKey>
}

export const APIKeysTable = (props: APIKeysTableProps) => {
    const {  page } = props
    const { t } = useTranslation()

    const columns = useAPIKeyColumn()

    const tableState = useTable({
        data: page?.items ?? [],
        columns: columns,
    })



    return (
            <Box>
                <Typography align="center">{t(".noData")}</Typography>
                <TableV2 tableState={Table<APIKey>} />

            </Box>



    )
}
