import { FilterComposableField, useFiltersComposable, Action, Option, FiltersComposable } from '@smartb/g2'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {OffsetPagination, Offset} from "template";

export interface useCustomFiltersParams {
    filters: FilterComposableField[]
    sortOptions?: Option[]
    defaultSortKey?: string
    withOffset?: boolean
    actions?: Action[]
    initialValues?: any
}

export const useCustomFilters = <T extends {} = any>(params: useCustomFiltersParams) => {
    const { filters, withOffset = true, actions, initialValues, sortOptions, defaultSortKey } = params
    const { t } = useTranslation()
    const onSubmit = useCallback(
        (values: any, submittedFilters: any) => {
            const pagination = withOffset ? Offset.default : undefined
            if (values.offset === submittedFilters.offset) return { ...values, ...pagination }
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

    const component = useMemo(() => (
        <FiltersComposable
            formState={formState}
            filterButtonProps={{ children: t("toFilterCount", { count: withOffset ? filtersCount - 2 : filtersCount }) }}
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
        setOffset
    }
}