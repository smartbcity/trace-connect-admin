import { getOrgRolesOptions, useCustomFilters } from 'components'
import { FilterComposableField } from '@smartb/g2'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgStatus } from '../profile/OrganizationForm'

export const useOrganizationFilters = () => {
    const {t} = useTranslation()
    const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])

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
                options: OrgStatus.map((status) => ({
                    key: status,
                    label: t("organizationStatus." + status)
                })),
                multiple: true
            }
        }
    ], [t])

    return useCustomFilters({filters: filters})
}
