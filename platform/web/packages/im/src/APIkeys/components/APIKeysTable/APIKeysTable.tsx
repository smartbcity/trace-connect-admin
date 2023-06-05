import {useMemo} from "react";
import {ColumnFactory, FormComposable, FormComposableField, useFormComposable, useTable} from "@smartb/g2";
import {TableCellAdmin, useDeletedConfirmationPopUp} from "components";
import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {OffsetPagination, OffsetTable, PageQueryResult} from "template";

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
                cell: ({}) => {
                    const formState = useFormComposable({
                        isLoading: false,
                        emptyValueInReadOnly: "-",
                        readOnly: true
                    })

                    const fields = useMemo((): FormComposableField<keyof APIKey>[] => [{
                        name: "identifier",
                        type: "textField",
                        label: t('identifier'),
                    },{
                        name: "created",
                        type: "datePicker",
                        label: t('created'),
                    }], [t])

                    const declineConfirmation = useDeletedConfirmationPopUp({
                        title: t("apiKeysList.delete"),
                        component :
                        <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                            <FormComposable display="grid" formState={formState}  fields={fields}/>
                            <Typography>{t("apiKeysList.deleteMessage")}</Typography>
                        </Stack>
                    });
                    return <><TableCellAdmin onDelete={() => declineConfirmation.handleOpen()}/>{declineConfirmation.popup}</>
                }
            }


        })
    }), [t]);
}

export interface APIKeysTableProps{
    page?: PageQueryResult<APIKey>
    pagination: OffsetPagination
    isLoading?: boolean
}

export const APIKeysTable = (props: APIKeysTableProps) => {
    const {  page, isLoading, pagination } = props
    const { t } = useTranslation()
    const columns = useAPIKeyColumn()

    const tableState = useTable({
        data: page?.items ?? [],
        columns: columns,
    })

    return (
                (!page?.items && !isLoading) ?
                    <Typography align="center">{t("apiKeysList.noKeys")}</Typography>
                    :
                    <OffsetTable<APIKey>
                         tableState={tableState}
                         page={page}
                         pagination={pagination}
                         isLoading={isLoading} />
    )
}
