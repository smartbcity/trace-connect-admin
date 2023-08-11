import { FilterComposableField, useFiltersComposable, Action, Option, FiltersComposable } from '@smartb/g2'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {OffsetPagination, Offset} from "template";

export interface useCustomFiltersParams {
    filters: FilterComposableField[]
    sortOptions?: Option[]
    defaultSortKey?: string
    withPage?: boolean
    withOffset?: boolean
    actions?: Action[]
    initialValues?: any
}

export const useCustomFilters = <T extends {} = any>(params: useCustomFiltersParams) => {
    const { filters, withPage = true, withOffset = false, actions, initialValues, sortOptions, defaultSortKey } = params
    const { t } = useTranslation()
    const onSubmit = useCallback(
        (values: any, submittedFilters: any) => {
            if (withOffset) {
                const pagination = Offset.default
                if (values.offset === submittedFilters.offset) return { ...values, ...pagination }
                return 
            }
            const page = withPage ? 0 : undefined
            if (values.page === submittedFilters.page) return { ...values, page: page }
        },
        [],
    )
    const { filtersCount, formState, submittedFilters, setAdditionalFilter } = useFiltersComposable<T & OffsetPagination>({
        onSubmit: onSubmit,
        formikConfig: {
            initialValues: {
                ...(withOffset ? {
                    offset: 0,
                    limit: 10
                } : withPage ? {
                    page: 0
                } : undefined),
                ...initialValues
            }
        }
    })

    const setOffset = useCallback(
        (newPage: OffsetPagination) => {
            setAdditionalFilter("offset", newPage.offset)
            setAdditionalFilter("limit", newPage.limit)
        },
        [setAdditionalFilter],
    )

    const setPage = useCallback(
        (newPage: number) => {
            setAdditionalFilter("page", newPage - 1)
        },
        [setAdditionalFilter],
    )

    const component = useMemo(() => (
        <FiltersComposable
            formState={formState}
            filterButtonProps={{ children: t("toFilterCount", { count: withPage ? filtersCount - 2 : filtersCount }) }}
            fields={filters}
            actions={actions}
            filterStyleProps={{ color: "default", variant: "outlined" }}
            style={{
                width: "100%"
            }}
        />
    ), [formState, filters, actions, filtersCount, sortOptions, defaultSortKey, t])

    return {
        component: component,
        submittedFilters,
        setOffset,
        setPage
    }
}