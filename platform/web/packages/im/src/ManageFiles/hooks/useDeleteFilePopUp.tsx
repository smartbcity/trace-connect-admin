import {useTranslation} from "react-i18next";
import {useDeletedConfirmationPopUp} from "components";
import { Typography} from "@mui/material";
import { FileDTO } from "../api";

interface useDeleteFilePopUpProps{
    onDeleteClick : (apiKey : FileDTO)  => Promise<void>
    file : FileDTO
}

export const useDeleteFilePopUp = (props :  useDeleteFilePopUpProps ) => {
    const { onDeleteClick, file } = props
    const { t } = useTranslation();

    return useDeletedConfirmationPopUp({
        title: t("fileList.delete"),
        component : <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("fileList.deleteMessage")}</Typography>,
        onDelete : () => onDeleteClick(file)
    });
}


