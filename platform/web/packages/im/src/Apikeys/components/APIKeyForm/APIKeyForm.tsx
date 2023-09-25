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
    const { roles, service } = useExtendedAuth()
    const organizationId = service.getUser()!!.memberOf ?? ""

    const fields = useMemo((): FormComposableField<keyof ApiKeyAddCommand>[] => {
        const refId = formState.values.organizationId ? formState.values.organizationId : organizationId
        const orgRole = roles?.find(
            (role) => role.identifier === orgRefs?.find((ref) => ref.id === refId)?.roles[0]
        )
        return [{
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
        } as FormComposableField<keyof ApiKeyAddCommand>] : []), {
            name: 'roles',
            type: 'select',
            label: t("role"),
            params: {
                options: getApiKeysRolesOptions(i18n.language, orgRole, roles),
                multiple: true,
            },
            validator: validators.requiredField(t)
        } as FormComposableField<keyof ApiKeyAddCommand>]
    }, [t, orgSelect, orgRefs, i18n.language, roles, formState.values.organizationId])

    return (
        <FormComposable
            fields={fields}
            formState={formState}
            readOnly={readOnly}
        />
    )
}