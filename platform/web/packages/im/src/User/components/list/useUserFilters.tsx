import { getUserRolesOptions, useCustomFilters } from 'components'
import { Action, FilterComposableField } from '@smartb/g2'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export interface useUserFiltersParams {
    searchOrg?: boolean
    actions?: Action[]
}

export const useUserFilters = (params?: useUserFiltersParams) => {
    const {searchOrg = false, actions} = params ?? {}
    const {t} = useTranslation()
  
    const rolesOptions = useMemo(() => getUserRolesOptions(t), [t])

    const filters = useMemo((): FilterComposableField[] => [
      {
        key: 'emailSearchFilter',
        name: 'email',
        type: 'textField',
        params: { textFieldType: 'search', placeholder: t("userList.email"), style: {minWidth: "280px"} }
      },
      {
        key: 'userRolesFilter',
        name: 'role',
        label: t("role"),
        type: 'select',
        params: {
          options: rolesOptions,
          multiple: true
        }
      },
      ...(searchOrg ? [{
        key: 'userSearchOrgFilter',
        name: 'organizationName',
        type: 'textField',
        params: { textFieldType: 'search', placeholder: t("userList.orgNameFilter"), style: {minWidth: "220px"} }
      } as FilterComposableField] : [])
    ], [t, searchOrg, rolesOptions])

    return useCustomFilters({filters: filters, actions})
}
