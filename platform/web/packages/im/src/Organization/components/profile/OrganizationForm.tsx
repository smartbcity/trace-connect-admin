import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormComposable, FormComposableField, FormComposableState } from "@smartb/g2";
import { useOrganizationFormFields } from "@smartb/g2-i2-v2";
import { getOrgRolesOptions, useExtendedAuth } from "components";

export interface OrganizationFormProps {
    isLoading: boolean
    formState: FormComposableState
    readOnly: boolean

}

export const OrganizationForm = (props: OrganizationFormProps) => {
    const { isLoading, formState, readOnly } = props
    const { t } = useTranslation();
    const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])
    const { service } = useExtendedAuth()
    const fieldsOverride = useMemo(() => {
        return {
            roles: {
                params: {
                    options: rolesOptions
                }
            }
        }
    }, [t, rolesOptions])

    const fields = useOrganizationFormFields({
        formState: formState,
        fieldsOverride: fieldsOverride
    })

    const finalFields = useMemo((): FormComposableField[] => [
        {
            ...fields.fields.name,
            label: t("companyName"),
            fullRow: !service.is_super_admin(),
        },
        ...(service.is_super_admin() ? [fields.fields.roles] : [])
        ,
        ...(
            readOnly ? [
                {
                    name: "readOnlyAddress",
                    type: "textField",
                    label: t("address"),
                } as FormComposableField
            ] : [
                fields.fields.street,
                fields.fields.postalCode,
                fields.fields.city,
            ]
        ),
        {
            name: "attributes.country",
            type: "textField",
            label: readOnly ? t("country") : t("optionalCountry"),
        },
        {
            ...fields.fields.description,
            label: readOnly ? t("description") : t("optionalDescription"),
            fullRow: true,
        },
    ], [t, fields.fields, service.is_super_admin, readOnly]);

    return (
        <FormComposable
            fields={finalFields}
            formState={formState}
            readOnly={readOnly}
            isLoading={isLoading}
            display="grid"
        />
    )
}