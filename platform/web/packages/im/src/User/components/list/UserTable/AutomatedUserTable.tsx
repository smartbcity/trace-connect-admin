import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { useCallback, useMemo, useState } from 'react'
import { UserTable, UserTableProps } from './UserTable'
import { i2Config, useAuth } from '@smartb/g2-providers'
import { useUserTableState, useUserTableStateParams } from './useUserTableState'
import { request } from '@smartb/g2-utils'
import {
  QueryFunctionContext,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query"
import { User, UserPageResult } from '@smartb/g2-i2-v2'

type UserGetAllQueryResultOptional<T extends User = User> =
  | { users: T[]; totalPages: number }
  | null

export type GetUsersOptions<T extends User = User> = Omit<
  UseQueryOptions<
    UserGetAllQueryResultOptional<T>,
    unknown,
    UserGetAllQueryResultOptional<T>,
    any[]
  >,
  'queryKey' | 'queryFn'
>

export interface GetUsersParams<T extends User = User> {
  /**
   * @default "organization"
   */
  queryKey?: string
  jwt?: string
  apiUrl: string
  options?: GetUsersOptions<T>
  queryParams?: any
}

export const useGetUsers = <T extends User = User>(
  params: GetUsersParams<T>
) => {
  const { apiUrl, jwt, options, queryKey = 'users', queryParams } = params

  const getUsers = useCallback(
    async ({ queryKey }: QueryFunctionContext<[string, any]>) => {
      const [_key, currentParams] = queryKey
      const res = await request<UserPageResult<T>[]>({
        url: `${apiUrl}/userPage`,
        method: 'POST',
        body: JSON.stringify({
          ...currentParams,
          size: currentParams?.size ?? 10
        }),
        jwt: jwt
      })
      if (res) {
        return {
          users: res[0]?.items,
          totalPages: Math.ceil(res[0]?.total / 10)
        }
      } else {
        return null
      }
    },
    [apiUrl, jwt]
  )
  //@ts-ignore
  return useQuery([queryKey, queryParams], getUsers, options)
}

// TODO Automated should be without getUsers and organizationsRefs
// we could use a parameter to disable organizationsRefs if needed
// jwt should be get by useAuth
// apiUrl should be a configuration out side of the components
export interface AutomatedUserTableBasicProps<T extends User = User>
  extends BasicProps {
  /**
   * The getUsers hook options
   */
  getUsersOptions?: GetUsersOptions<T>
  /**
   * Pass the current state of the filters
   */
  filters?: any
  /**
   * Override the default local page state
   */
  page?: number
  /**
   * the event called when the page changes
   */
  setPage?: (newPage: number) => void
}

export type AutomatedUserTableProps<T extends User = User> =
  MergeMuiElementProps<
    Omit<
      UserTableProps<T> & useUserTableStateParams<T>,
      | 'users'
      | 'onFiltersChanged'
      | 'totalPages'
      | 'page'
      | 'setPage'
      | 'tableState'
    >,
    AutomatedUserTableBasicProps<T>
  >

export const AutomatedUserTable = <T extends User = User>(
  props: AutomatedUserTableProps<T>
) => {
  const {
    filters,
    getUsersOptions,
    page,
    setPage,
    columnsExtander,
    getOrganizationUrl,
    hasOrganizations,
    ...other
  } = props

  const [localPage, localSetPage] = useState<number>(1)

  const { keycloak } = useAuth()

  console.log({
    page: localPage - 1,
    ...filters
  })

  const params = useMemo(() => ({
    page: localPage - 1,
    ...filters,
    // role: undefined
  }), [filters, localPage])

  const getUsers = useGetUsers({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    queryParams: params,
    options: getUsersOptions
  })

  const tableState = useUserTableState<T>({
    users: getUsers.data?.users ?? [],
    columnsExtander,
    getOrganizationUrl,
    hasOrganizations
  })

  return (
    <UserTable<T>
      page={page ?? localPage}
      setPage={setPage ?? localSetPage}
      isLoading={!getUsers.isSuccess}
      tableState={tableState}
      totalPages={
        getUsers.data?.totalPages && getUsers.data?.totalPages > 1
          ? getUsers.data?.totalPages
          : undefined
      }
      {...other}
    />
  )
}
