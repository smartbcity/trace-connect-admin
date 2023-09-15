import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  G2ColumnDef,
  TableCellLink,
  TableCellProfile,
  TableCellText
} from '@smartb/g2-layout'
import { User } from '../../Domain'
import { MenuItem, MoreOptions } from '@smartb/g2-components'
import { OrganizationId } from '../../../Organization'

export type userTableColumns = 'givenName' | 'address' | 'email' | 'memberOf'

export interface useUserColumnsParams<T extends User> {
  /**
   * The actions available on a organization
   */
  getActions?: (org: T) => MenuItem<{}>[]
  /**
   * If you want the columns organization to contain links redirecting to the organization page provide this prop
   */
  getOrganizationUrl?: (organizationId: OrganizationId) => string
  /**
   * Force the display of the organization over the user list (if the first user of the list has no organization)
   *
   * @default false
   */
  hasOrganizations?: boolean
  /**
   * The user to pe parsed in the table
   */
  users?: T[]
}

export const useUserColumns = <T extends User = User>(
  params?: useUserColumnsParams<T>
) => {
  const { getActions, getOrganizationUrl, hasOrganizations, users } =
    params ?? {}
  const { t } = useTranslation()
  const columns = useMemo(
    () => ({
      givenName: {
        header: t('g2.name'),
        id: 'givenName',
        cell: ({ row }) => (
          <TableCellProfile
            familyName={row.original.familyName}
            givenName={row.original.givenName}
          />
        ),
        className: 'givenNameColumn'
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
      email: {
        header: t('g2.email'),
        id: 'email',
        cell: ({ row }) => <TableCellText value={row.original.email} />,
        className: 'emailColumn'
      } as G2ColumnDef<T>,
      ...((!!users && !!users[0] && !!users[0].memberOf) || hasOrganizations
        ? {
            memberOf: {
              header: t('g2.organization'),
              id: 'memberOf',
              cell: ({ row }) => {
                if (!!getOrganizationUrl && row.original.memberOf?.id) {
                  return (
                    <TableCellLink
                      href={getOrganizationUrl(row.original.memberOf?.id)}
                      label={row.original.memberOf?.name}
                    />
                  )
                }
                return <TableCellText value={row.original.memberOf?.name} />
              },
              className: 'memberOfColumn'
            } as G2ColumnDef<T>
          }
        : {}),
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
    [users, getOrganizationUrl, t, hasOrganizations, getActions]
  )

  const columnsArray = useMemo(() => Object.values(columns), [columns])

  return {
    columns,
    columnsArray
  }
}
