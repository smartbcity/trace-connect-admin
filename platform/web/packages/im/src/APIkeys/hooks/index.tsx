import {useTranslation} from "react-i18next";
import {TableCellAdmin, useDeletedConfirmationPopUp} from "components";
import {useMemo} from "react";
import {G2ColumnDef} from "@smartb/g2-layout";
import {Stack} from "@mui/material";

export const useAPIKeysListPage = () => {

    const { t } = useTranslation();

    const additionalColumns = useMemo((): G2ColumnDef<any>[] => {
        return [{
            header: t("actions"),
            id: "delete",
            cell: ({}) => {
                const declineConfirmation = useDeletedConfirmationPopUp({
                    title: t("apiKeysList.delete"),
                    description: t("apiKeysList.deleteMessage"),
                    component : <Stack display='grid'>yoyo</Stack>
                });

                return <><TableCellAdmin onDelete={() => declineConfirmation.handleOpen()}/>{declineConfirmation.popup}</>
            },
        },
        ]
    }, [])

    return {
        additionalColumns
    }
}