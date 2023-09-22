import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormComposable, FormComposableField, FormComposableState, useTheme } from "@smartb/g2";
import { useOrganizationFormFields } from "connect-im";
import { getOptionsOfStatusValues, getOrgRolesOptions, useExtendedAuth } from "components";
import { usePolicies } from "../../../Policies/usePolicies";
import { city } from "@smartb/organization-domain"

export interface OrganizationFormProps {
    isLoading: boolean
    formState: FormComposableState
    readOnly?: boolean
    isUpdate?: boolean
    canVerify?: boolean
    myOrganization?: boolean
}

export const OrgStatusValues = city.smartb.im.f2.organization.domain.model.OrganizationStatusValues

export const OrganizationForm = (props: OrganizationFormProps) => {
    const { isLoading, formState, readOnly = false, isUpdate = false, myOrganization} = props
    const { t, i18n } = useTranslation();
    const { roles } = useExtendedAuth()
    const rolesOptions = useMemo(() => getOrgRolesOptions(i18n.language, roles), [i18n.language, roles])
    const policies = usePolicies({myOrganization: myOrganization})
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
        ...(policies.organization.canVerify ? [
            {
                name: "status",
                type: "select",
                label: t("status"),
                params: {
                    options: getOptionsOfStatusValues({
                        statusValues: OrgStatusValues,
                        getLabel: (status) => t("organizationStatus." + status),
                        getColor: (status) => status === OrgStatusValues.validated() ? theme.colors.success : status === OrgStatusValues.pending() ? theme.colors.warning : theme.colors.error
                    }),
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