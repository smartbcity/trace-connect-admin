import { getOrgRolesOptions, useExtendedAuth, useRoutesDefinition } from "components"
import { Stack, Typography } from '@mui/material'
import { Action, Page, Section, LinkButton, validators } from '@smartb/g2'
import { OrganizationFactory, useOrganizationFormState, OrganizationFactoryFieldsOverride } from '@smartb/g2-i2-v2'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { OrganizationUserList } from './OrganizationUserList'

export interface OrganizationProfilePageProps {
    readOnly: boolean
    myOrganization?: boolean
}

export const OrganizationProfilePage = (props: OrganizationProfilePageProps) => {
    const { readOnly, myOrganization = false } = props
    const { t } = useTranslation();
    const { organizationId } = useParams();
    const navigate = useNavigate()
    const { service } = useExtendedAuth()
    const [currentTab, setCurrentTab] = useState("details")
    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit } = useRoutesDefinition()

    const orgId = myOrganization ? service.getUser()?.memberOf : organizationId
    const isUpdate = !!organizationId || myOrganization

    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(organizationsOrganizationIdView(data.id))
        },
        [navigate, organizationsOrganizationIdView],
    )

    const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])

    const { formState, isLoading, organization } = useOrganizationFormState({
        createOrganizationOptions: {
            onSuccess: onSave,
        },
        updateOrganizationOptions: {
            onSuccess: onSave,
        },
        organizationId,
        update: isUpdate,
        myOrganization: myOrganization,
        multipleRoles: false,
    })

    const headerRightPart = useMemo(() => {
        if (readOnly) {
            return [
                <LinkButton to={organizationsOrganizationIdEdit(orgId!)} key="pageEditButton">{t("update")}</LinkButton>,
            ]
        }
        return []
    }, [readOnly, orgId, organizationsOrganizationIdEdit])

    const actions = useMemo((): Action[] | undefined => {
        if (!readOnly) {
            return [{
                key: "cancel",
                label: t("cancel"),
                onClick: () => navigate(-1),
                variant: "text"
            }, {
                key: "save",
                label: t("save"),
                onClick: formState.submitForm
            }]
        }
    }, [readOnly, formState.submitForm])

    const userListFilters = useMemo(() => ({
        organizationId: orgId
    }), [orgId])

    const leftSectionTabs = useMemo(() => [{
        key: 'details',
        label: t('details')
    },
    ...(!!userListFilters.organizationId ? [{
        key: 'members',
        label: t('members')
    }] : []),
    ], [t, userListFilters.organizationId, service.executeAuthFunction])

    const onTabChange = useCallback((_: React.SyntheticEvent<Element, Event>, value: string) => {
        setCurrentTab(value)
    }, [])

    const fieldsOverride = useMemo((): OrganizationFactoryFieldsOverride => {
        return {
            roles: {
                params: {
                    options: rolesOptions
                },
                validator: validators.requiredField(t)
            }
        }
    }, [t, rolesOptions])

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography sx={{ flexShrink: 0 }} color="primary" variant="h5" key="pageTitle">{myOrganization ? t("myOrganization") : organization?.name ?? t("organizations")}</Typography>
                    ],
                    rightPart: headerRightPart
                }]
            }}
            bottomActionsProps={{
                actions: actions
            }}
        >
            <Stack
                direction="row"
                gap={5}
                alignItems="flex-start"
            >
                <Section sx={{
                    width: "310px",
                    flexShrink: 0
                }}>
                    <OrganizationFactory
                        readOnly={readOnly}
                        multipleRoles={false}
                        formState={formState}
                        organization={organization}
                        isLoading={isLoading}
                        fieldsOverride={fieldsOverride}
                    />
                </Section>
                <Section
                    sx={{
                        flexGrow: 1,
                    }}
                    flexContent
                    headerProps={{
                        tabs: leftSectionTabs,
                        currentTab: currentTab,
                        onTabChange: onTabChange
                    }}
                >
                    {currentTab === "members" && <OrganizationUserList organizationId={orgId} userListFilters={userListFilters} />}
                </Section>
            </Stack>
        </Page>
    )
}
