import { FilterComposableField, useFiltersComposable, Action, Option, FiltersComposable } from '@smartb/g2'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export interface useCustomFiltersParams {
    filters: FilterComposableField[]
    sortOptions?: Option[]
    defaultSortKey?: string
    withPage?: boolean
    actions?: Action[]
    initialValues?: any
}

export const useCustomFilters = <T extends {} = any>(params: useCustomFiltersParams) => {
    const { filters, withPage = true, actions, initialValues, sortOptions, defaultSortKey } = params
    const { t } = useTranslation()
    const onSubmit = useCallback(
        (values: any, submittedFilters: any) => {
            const page = withPage ? 0 : undefined
            if (values.page === submittedFilters.page) return { ...values, page: page }
        },
        [],
    )
    const { filtersCount, formState, submittedFilters, setAdditionalFilter } = useFiltersComposable<T & { page: number }>({
        onSubmit: onSubmit,
        formikConfig: {
            initialValues: {
                ...(withPage ? {
                    page: 0
                } : undefined),
                ...initialValues
            }
        }
    })

    const setPage = useCallback(
        (newPage: number) => {
            setAdditionalFilter("page", newPage - 1)
        },
        [setAdditionalFilter],
    )

    const component = useMemo(() => (
        <FiltersComposable
            formState={formState}
            filterButtonProps={{ children: t("toFilterCount", { count: withPage ? filtersCount - 1 : filtersCount }) }}
            fields={filters}
            actions={actions}
            filterStyleProps={{ color: "default", variant: "outlined" }}
            responsiveFiltersProps={{
                drawerTitle: t("toFilter") as string,
                applyString: t("apply") as string,
                clearString: t("clearFilters") as string
            }}
        />
    ), [formState, filters, actions, filtersCount, sortOptions, defaultSortKey, t])

    return {
        component: component,
        submittedFilters,
        setPage
    }
}