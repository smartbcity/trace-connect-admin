import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormComposable, FormComposableField, FormComposableState, useTheme } from "@smartb/g2";
import { useOrganizationFormFields } from "@smartb/g2-i2-v2";
import { getOrgRolesOptions, useExtendedAuth } from "components";
import { usePolicies } from "../../../Policies/usePolicies";

export interface OrganizationFormProps {
    isLoading: boolean
    formState: FormComposableState
    readOnly: boolean
    isUpdate?: boolean
    canVerify?: boolean
    policies: ReturnType<typeof usePolicies>
}

export const OrgStatus = ["VERIFIED" , "WAITING" , "REFUSED"] as const

export const OrganizationForm = (props: OrganizationFormProps) => {
    const { isLoading, formState, readOnly, isUpdate = false, policies} = props
    const { t, i18n } = useTranslation();
    const { roles } = useExtendedAuth()
    const rolesOptions = useMemo(() => getOrgRolesOptions(i18n.language, roles), [i18n.language, roles])
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
            fullRow: !(readOnly || policies.organization.canUpdateRoles),
        },
        ...(readOnly || policies.organization.canUpdateRoles ? [fields.fields.roles] : []),
        ...(isUpdate && policies.organization.canVerify ? [
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
    ], [t, fields.fields, readOnly, isUpdate, policies.organization, theme]);

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