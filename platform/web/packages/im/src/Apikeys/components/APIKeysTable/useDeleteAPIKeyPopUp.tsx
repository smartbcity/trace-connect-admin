import {useTranslation} from "react-i18next";
import {FormComposable, FormComposableField, useFormComposable} from "@smartb/g2";
import {useMemo} from "react";
import {useDeletedConfirmationPopUp} from "components";
import {Stack, Typography} from "@mui/material";
import {ApiKeyDTO} from "../../api";

interface useDeleteAPIKeyPopUpProps{
    onDeleteClick : (apiKey : ApiKeyDTO)  => Promise<void>
    apiKey : ApiKeyDTO
}

export const useDeleteAPIKeyPopUp = (props :  useDeleteAPIKeyPopUpProps ) => {
    const { onDeleteClick, apiKey } = props
    const { t } = useTranslation();

    const formState = useFormComposable({
        emptyValueInReadOnly: "-",
        readOnly: true,
        formikConfig : {
            initialValues : {
                ...apiKey
            }
        }
    })
    const fields = useMemo((): FormComposableField<keyof ApiKeyDTO>[] => [{
        name: "identifier",
        type: "textField",
        label: t('identifier'),
    },{
        name: "creationDate",
        type: "datePicker",
        label: t('created'),
    }], [t])

    return useDeletedConfirmationPopUp({
        title: t("apiKeysList.delete"),
        component :
            <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                <FormComposable display="grid" formState={formState}  fields={fields}/>
                <Typography>{t("apiKeysList.deleteMessage")}</Typography>
            </Stack>,
        onDelete : () => onDeleteClick(apiKey)
    });
}
