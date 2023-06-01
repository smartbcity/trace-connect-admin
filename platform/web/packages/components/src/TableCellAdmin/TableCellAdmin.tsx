import {useTranslation} from "react-i18next";
import {IconButton, Stack} from "@mui/material";
import {Tooltip} from "@smartb/g2";
import {DeleteRounded, EditRounded} from "@mui/icons-material";
import {useDeletedConfirmationPopUp} from "./useDeletedConfirmationPopUp";

export interface TableCellAdminProps {
}

export const TableCellAdmin = (props: TableCellAdminProps) => {
    const {} = props
    const { t } = useTranslation()

    const declineConfirmation = useDeletedConfirmationPopUp({
        title: t("userList.delete"),
        description: t('userList.deleteMessage')
    })

    return (
        <>
        <Stack
            direction="row"
        >
            <Tooltip helperText={t('userList.delete')}>
                <IconButton aria-label="delete" onClick={(e) =>{
                    declineConfirmation.handleOpen()
                    e.stopPropagation()
                    }}>
                    <DeleteRounded/>
                </IconButton>
            </Tooltip>
            <Tooltip helperText={t('edit')}>
                <IconButton aria-label="edit" onClick={e => e.stopPropagation()}>
                    <EditRounded/>
                </IconButton>
            </Tooltip>
        </Stack>
            {declineConfirmation.popup}
        </>
    )
}
