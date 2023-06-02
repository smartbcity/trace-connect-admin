import {useTranslation} from "react-i18next";
import {TableCellAdmin, useDeletedConfirmationPopUp} from "components";
import {useCallback, useMemo} from "react";
import {G2ColumnDef} from "@smartb/g2-layout";
import {Stack} from "@mui/material";

export const useAPIKeysListPage = () => {

    const { t } = useTranslation();

    const declineConfirmation = useDeletedConfirmationPopUp({
        title: t("apiKeysList.delete"),
        description: t("apiKeysList.deleteMessage"),
        component : <Stack display='grid'>yoyo</Stack>
    });

    const onDelete = useCallback(
        () => {
            declineConfirmation.handleOpen();
        },
        [declineConfirmation]
    );

    const additionalColumns = useMemo((): G2ColumnDef<any>[] => {
        return [{
            header: t("actions"),
            id: "delete",
            cell: ({}) => {
                return <><TableCellAdmin onDelete={onDelete}/>{declineConfirmation.popup}</>
            },
        },
        ]
    }, [declineConfirmation])

    return {
        additionalColumns
    }
}