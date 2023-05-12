import { Typography } from '@mui/material'
import { Action } from '@smartb/g2'
import { AutomatedUserTable } from '@smartb/g2-i2-v2'
import { useRoutesDefinition } from "components"
import { useTranslation } from 'react-i18next'
import { useUserListPage } from '../../../User/hooks'
import { useUserFilters } from '../../../User/components/list/useUserFilters'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'

export interface OrganizationUserListProps {
    organizationId?: string
    userListFilters: {
        organizationId?: string;
    }
}

export const OrganizationUserList = (props: OrganizationUserListProps) => {
    const { organizationId, userListFilters } = props
    const { usersAdd } = useRoutesDefinition()
    const { getActions, onRowClicked, additionnalColumns } = useUserListPage()
    const { t } = useTranslation()
    const actions = useMemo((): Action[] => organizationId ? [ {
        key: "addAUser",
        label: t("userList.create"),
        component: Link,
        componentProps: { to: usersAdd(organizationId) },
        sx: { flexShrink: 0 }
    }] : [], [usersAdd, t, organizationId])
    const { component, submittedFilters, setPage } = useUserFilters({ actions })
    return (
        <>
            {component}
            <AutomatedUserTable
                columnsExtander={{
                    getActions: getActions,
                    blockedColumns: userTableBlockedColumns,
                    additionnalColumns
                }}
                onRowClicked={onRowClicked}
                filters={{ ...userListFilters, ...submittedFilters }}
                noDataComponent={<Typography align="center">{t("userList.noUserOrg")}</Typography>}
                expectedSize={5}
                page={submittedFilters.page + 1}
                setPage={setPage}
            />
        </>
    )
}

const userTableBlockedColumns = ["memberOf", "address", "email"]
