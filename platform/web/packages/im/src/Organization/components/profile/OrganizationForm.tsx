import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormComposable, FormComposableField, FormComposableState, useTheme } from "@smartb/g2";
import { useOrganizationFormFields } from "@smartb/g2-i2-v2";
import { getOrgRolesOptions, useExtendedAuth } from "components";

export interface OrganizationFormProps {
    isLoading: boolean
    formState: FormComposableState
    readOnly: boolean
    isUpdate?: boolean
    canVerify?: boolean
}

export const OrgStatus = ["VERIFIED" , "WAITING" , "REFUSED"] as const

export const OrganizationForm = (props: OrganizationFormProps) => {
    const { isLoading, formState, readOnly, isUpdate = false, canVerify = false } = props
    const { t } = useTranslation();
    const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])
    const { service } = useExtendedAuth()
    const theme = useTheme()
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
        ...(service.is_super_admin() ? [fields.fields.roles] : []),
        ...(isUpdate && canVerify ? [
            {
                name: "status",
                type: "select",
                label: t("status"),
                params: {
                    options: OrgStatus.map((status) => ({
                        key: status,
                        label: t("organizationStatus." + status),
                        color: status === "VERIFIED" ? theme.colors.success : status === "WAITING" ? theme.colors.warning : theme.colors.error
                    })),
                    readOnlyType: 'chip'
                }
            } as FormComposableField
        ] : []),
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
    ], [t, fields.fields, service.is_super_admin, readOnly, isUpdate, canVerify, theme]);

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