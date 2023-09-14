import {useTranslation} from "react-i18next";
import {useDeletedConfirmationPopUp} from "components";
import {Typography} from "@mui/material";
import {Organization} from "connect-im";
import {useCallback, useState} from "react";

interface useDeleteOrganizationPopUpProps{
    onDeleteClick : (organization : Organization)  => Promise<void>
}
export const useDeleteOrganizationPopUp = (props: useDeleteOrganizationPopUpProps) => {
    const { t } = useTranslation();
    const { onDeleteClick } = props;
    const [organization, setOrganization] = useState<Organization | undefined>(undefined)
    const orgDelete = useCallback(async () => {
        organization && await onDeleteClick(organization)
    }, [organization])

    const popup = useDeletedConfirmationPopUp({
        title: t("organizationList.delete"),
        component : <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("organizationList.deleteMessage")}</Typography>,
        onDelete : orgDelete
    });

    const open = useCallback(
        (organization: Organization) => {
            setOrganization(organization)
            popup.setOpen(true)
        },
        [popup.setOpen],
    )
    
    return {
        ...popup,
        open
    }
}