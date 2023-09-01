import { FormComposable, FormComposableField, FormComposableState, OrganizationRef, validators } from "@smartb/g2";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ApiKeyAddCommand } from "../../api";
import { getApiKeysRolesOptions, useExtendedAuth } from "components";

export interface APIKeyFormProps {
    readOnly: boolean
    formState: FormComposableState
    orgSelect?: boolean
    orgRefs?: OrganizationRef[]
}

export const APIKeyForm = (props: APIKeyFormProps) => {
    const { readOnly, formState, orgSelect = false, orgRefs } = props
    const { t, i18n } = useTranslation();
    const {roles} = useExtendedAuth()

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
    } as FormComposableField<keyof ApiKeyAddCommand>,{
        name: 'role',
        type: 'select',
        label: t("role"),
        params: {
            options: getApiKeysRolesOptions(i18n.language, roles)
        },
        validator: validators.requiredField(t)
    } as FormComposableField<keyof ApiKeyAddCommand>] : [])], [t, orgSelect, orgRefs, i18n.language, roles])

    return (
        <FormComposable
            fields={fields}
            formState={formState}
            readOnly={readOnly}
        />
    )
}