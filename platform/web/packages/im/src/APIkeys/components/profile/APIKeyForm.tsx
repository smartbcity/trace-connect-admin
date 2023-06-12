import {FormComposable, FormComposableField, FormComposableState} from "@smartb/g2";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";
import {APIKeyDTO} from "../../api";

export interface APIKeyFormProps {
    readOnly: boolean
    formState:  FormComposableState
}

export const APIKeyForm = (props: APIKeyFormProps) => {
    const {  readOnly, formState } = props
    const { t } = useTranslation();

    const fields = useMemo((): FormComposableField<keyof APIKeyDTO>[] => [{
        name: "name",
        type: "textField",
        label: t('name'),
    }], [t])

    return (
        <FormComposable
            fields={fields}
            formState={formState}
            readOnly={readOnly}
        />
    )
}