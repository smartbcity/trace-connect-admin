import {useCallback, useMemo} from "react";
import {ColumnFactory, FormComposable, FormComposableField, useFormComposable, useTable} from "@smartb/g2";
import {TableCellAdmin, useDeletedConfirmationPopUp} from "components";
import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {OffsetPagination, OffsetTable, PageQueryResult} from "template";
import {APIKeyDTO, useOrganizationRemoveAPIKeyFunction} from "../../api";
function useAPIKeyColumn() {
    const { t } = useTranslation();
    return useMemo(() => ColumnFactory<APIKeyDTO>({
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
                    value: registry.identifier
                })
            }),

            date: generators.date({
                header: t("created"),
                getCellProps: (registry) => ({
                    date: registry.creationDate
                })
            }),
            // @ts-ignore
            action : ({
                cell: ({row}) => {
                    const formState = useFormComposable({
                        emptyValueInReadOnly: "-",
                        readOnly: true,
                        formikConfig : {
                            initialValues : {
                                ...row.original
                            }
                        }
                    })
                    const fields = useMemo((): FormComposableField<keyof APIKeyDTO>[] => [{
                        name: "identifier",
                        type: "textField",
                        label: t('identifier'),
                    },{
                        name: "creationDate",
                        type: "datePicker",
                        label: t('created'),
                    }], [t])

                    const useOrganizationRemoveAPIKey= useOrganizationRemoveAPIKeyFunction()
                    const onDelete = useCallback(async ()=>{
                        return await useOrganizationRemoveAPIKey.mutateAsync({
                            id: row.original.id,
                            keyId: row.original.id
                        })
                    },[])

                    const declineConfirmation = useDeletedConfirmationPopUp({
                        title: t("apiKeysList.delete"),
                        component :
                        <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                            <FormComposable display="grid" formState={formState}  fields={fields}/>
                            <Typography>{t("apiKeysList.deleteMessage")}</Typography>
                        </Stack>,
                        onDelete : onDelete
                    });
                    return <><TableCellAdmin onDelete={() => declineConfirmation.handleOpen()}/>{declineConfirmation.popup}</>
                }
            })
        })
    }), [t]);
}

export interface APIKeysTableProps{
    page?: PageQueryResult<APIKeyDTO>
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
                <OffsetTable<APIKeyDTO>
                     tableState={tableState}
                     page={page}
                     pagination={pagination}
                     isLoading={isLoading}
                />
        )
}
