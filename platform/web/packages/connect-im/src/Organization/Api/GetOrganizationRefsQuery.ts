import { useCallback, useMemo } from 'react'
import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query'
import { OrganizationRef } from '../Domain'
import { request } from '@smartb/g2-utils'
import { i2Config } from '@smartb/g2-providers'

export interface OrganizationRefsAllQuery {}

export interface OrganizationRefsAllResult {
  items: OrganizationRef[]
}

export type GetOrganizationRefsOptions<
  R extends QueryKey = OrganizationRefsAllQuery[]
> = Omit<
  UseQueryOptions<
    OrganizationRefsAllResult,
    unknown,
    OrganizationRefsAllResult,
    R
  >,
  'queryKey' | 'queryFn'
>

export interface OrganizationRefsAllParams<
  R extends QueryKey = OrganizationRefsAllQuery[]
> {
  queryKey?: string
  jwt?: string
  options?: GetOrganizationRefsOptions<R>
}

export const useGetOrganizationRefs = (params?: OrganizationRefsAllParams) => {
  const { jwt, options, queryKey = 'organizationRefs' } = params ?? {}

  const getOrganizationRefs = useCallback(fetchOrganizationRefs(jwt), [jwt])
//@ts-ignore
  const query = useQuery([queryKey], getOrganizationRefs, options)

  const map = useMemo(() => {
    if (query.data?.items) {
      return new Map(query.data.items.map((o) => [o.id, o]))
    }
    return new Map<string, OrganizationRef>()
  }, [query.data])

  return {
    query: query,
    map: map
  }
}

export const usePrefetchOrganizationRefs = async (
  params?: OrganizationRefsAllParams<[string]>
) => {
  const { jwt, options, queryKey = 'organizationRefs' } = params ?? {}
  const getOrganizationRefs = useCallback(fetchOrganizationRefs(jwt), [jwt])
  const queryClient = useQueryClient()
  queryClient.prefetchQuery([queryKey], getOrganizationRefs, options)
}

const fetchOrganizationRefs =
  (jwt?: string) => async (): Promise<OrganizationRefsAllResult> => {
    const res = await request<OrganizationRefsAllResult[]>({
      url: `${i2Config().orgUrl}/organizationRefList`,
      method: 'POST',
      body: '[{}]',
      jwt: jwt
    })
    if (res) {
      return {
        items: res[0]?.items || []
      }
    } else {
      return {
        items: []
      }
    }
  }
