import { useCustomFilters } from 'components'
import { FilterComposableField } from '@smartb/g2'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { OrganizationRef } from 'connect-im'

export interface useApiKeysFiltersParams {
    canFilterOrg?: boolean
    orgRef?: OrganizationRef[]
}

export const useApiKeysFilters = (params?: useApiKeysFiltersParams) => {
    const {canFilterOrg = false, orgRef} = params ?? {}
    const {t} = useTranslation()

    const filters = useMemo((): FilterComposableField[] => [
      ...(canFilterOrg ? [{
        key: 'organizationId',
        name: 'organizationId',
        type: 'select',
        label: t("organization"),
        params: { 
          options: orgRef?.map((ref) => ({
            key: ref.id,
            label: ref.name
          }))
         }
      } as FilterComposableField] : [])
    ], [t, canFilterOrg, orgRef])

    return useCustomFilters({filters: filters, withOffset: true})
}
