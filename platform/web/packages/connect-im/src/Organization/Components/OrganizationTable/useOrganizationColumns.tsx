import { useMemo } from 'react'
import { Organization } from '../../Domain'
import { useTranslation } from 'react-i18next'
import { TableCellText, G2ColumnDef } from '@smartb/g2-layout'
import {
  Link,
  MenuItem,
  MoreOptions,
  Presentation
} from '@smartb/g2-components'

export type OrganizationTableColumns = 'name' | 'address' | 'website'

export interface useOrganizationColumnsParams<T extends Organization> {
  /**
   * The actions available on a organization
   */
  getActions?: (org: T) => MenuItem<{}>[]
}

export const useOrganizationColumns = <T extends Organization = Organization>(
  params?: useOrganizationColumnsParams<T>
) => {
  const { getActions } = params ?? {}
  const { t } = useTranslation()
  const columns = useMemo(
    () => ({
      name: {
        header: t('g2.organization'),
        id: 'name',
        cell: ({ row }) => (
          <Presentation
            displayAvatar={false}
            label={row.original.name}
            imgSrc={row.original.logo}
          />
        ),
        className: 'nameColumn'
      } as G2ColumnDef<T>,
      address: {
        header: t('g2.address'),
        id: 'address',
        cell: ({ row }) =>
          row.original.address ? (
            <TableCellText
              value={`${row.original.address.street} ${row.original.address.postalCode} ${row.original.address.city}`}
            />
          ) : undefined,
        className: 'addressColumn'
      } as G2ColumnDef<T>,
      website: {
        header: t('g2.website'),
        id: 'website',
        cell: ({ row }) => (
          <Link
            href={row.original.website}
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.website}
          </Link>
        ),
        className: 'websiteColumn'
      } as G2ColumnDef<T>,
      ...(getActions
        ? {
            actions: {
              id: 'moreoptions',
              cell: ({ row }) => (
                <MoreOptions
                  options={getActions(row.original)}
                  onClick={(e) => e.stopPropagation()}
                />
              )
            } as G2ColumnDef<T>
          }
        : {})
    }),
    [t, getActions]
  )

  const columnsArray = useMemo(() => Object.values(columns), [columns])
  return {
    columns,
    columnsArray
  }
}
