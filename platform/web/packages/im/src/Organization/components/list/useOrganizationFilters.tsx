import { getOptionsOfStatusValues, getOrgRolesOptions, useCustomFilters, useExtendedAuth } from 'components'
import { FilterComposableField } from '@smartb/g2'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgStatusValues } from '../profile/OrganizationForm'

export const useOrganizationFilters = () => {
    const {t, i18n} = useTranslation()
    const {roles} = useExtendedAuth()
    const rolesOptions = useMemo(() => getOrgRolesOptions(i18n.language, roles), [i18n.language, roles])

    const filters = useMemo((): FilterComposableField[] => [
        {
            name: 'name',
            type: 'textField',
            params: { 
                textFieldType: 'search', 
                placeholder: t("name") as string, 
                style: { minWidth: "220px" } },
            mandatory: true
        },
        {
            name: 'roles',
            label: t("role"),
            type: 'select',
            params: {
                options: rolesOptions,
                multiple: true
            }
        },
        {
            name: 'status',
            label: t("status"),
            type: 'select',
            params: {
                options: getOptionsOfStatusValues({
                    statusValues: OrgStatusValues,
                    getLabel: (status) => t("organizationStatus." + status),
                }),
                multiple: true
            }
        }
    ], [t])

    return useCustomFilters({filters: filters})
}
