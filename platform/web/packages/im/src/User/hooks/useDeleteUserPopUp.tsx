import {useTranslation} from "react-i18next";
import {useDeletedConfirmationPopUp} from "components";
import {Typography} from "@mui/material";
import {User} from "@smartb/g2-i2-v2";
import {useCallback, useState} from "react";

interface UseDeleteUserPopUpProps{
    onDeleteClick : (user : User)  => Promise<void>
}
export const useDeleteUserPopUp = (props: UseDeleteUserPopUpProps) => {
    const { t } = useTranslation();
    const { onDeleteClick } = props;
    const [user, setUser] = useState<User | undefined>(undefined)
    const userDelete = useCallback(async () => {
        user && await onDeleteClick(user)
    }, [user])

    const popup = useDeletedConfirmationPopUp({
        title: t("userList.delete"),
        component : <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("userList.deleteMessage")}</Typography>,
        onDelete : userDelete
    });
    return {
        ...popup,
        open: (user: User) => {
            setUser(user)
            popup.setOpen(true)
        }
    }
}