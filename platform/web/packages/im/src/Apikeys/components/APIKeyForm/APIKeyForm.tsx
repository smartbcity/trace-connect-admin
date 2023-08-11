import { FormComposable, FormComposableField, FormComposableState, OrganizationRef, validators } from "@smartb/g2";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ApiKeyAddCommand } from "../../api";

export interface APIKeyFormProps {
    readOnly: boolean
    formState: FormComposableState
    orgSelect?: boolean
    orgRefs?: OrganizationRef[]
}

export const APIKeyForm = (props: APIKeyFormProps) => {
    const { readOnly, formState, orgSelect = false, orgRefs } = props
    const { t } = useTranslation();

    console.log(orgSelect)

    const fields = useMemo((): FormComposableField<keyof ApiKeyAddCommand>[] => [{
        name: "name",
        type: "textField",
        label: t('name'),
        validator: validators.requiredField(t)
    },
    ...(orgSelect ? [{
        name: 'organizationId',
        type: 'autoComplete',
        label: t("organization"),
        params: {
            options: orgRefs?.map((ref) => ({
                key: ref.id,
                label: ref.name
            }))
        },
        validator: validators.requiredField(t)
    } as FormComposableField<keyof ApiKeyAddCommand>] : [])], [t, orgSelect, orgRefs])

    console.log(fields)

    return (
        <FormComposable
            fields={fields}
            formState={formState}
            readOnly={readOnly}
        />
    )
}