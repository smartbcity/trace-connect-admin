import { getOrgRolesOptions, useChainedValidation, useExtendedAuth, useRoutesDefinition } from "components"
import { Stack, Typography } from '@mui/material'
import { Action, Page, Section, LinkButton } from '@smartb/g2'
import { AutomatedOrganizationFactory, MyOrganization, useOrganizationFormState, OrganizationFactoryFieldsOverride } from '@smartb/g2-i2-v2'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { OrganizationUserList } from './OrganizationUserList'

export interface OrganizationProfilePageProps {
    readonly: boolean
    myOrganization?: boolean
}

export const OrganizationProfilePage = (props: OrganizationProfilePageProps) => {
    const { readonly, myOrganization = false } = props
    const { t } = useTranslation();
    const { organizationId } = useParams();
    const navigate = useNavigate()
    const { service } = useExtendedAuth()
    const [currentTab, setCurrentTab] = useState("members")
    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit } = useRoutesDefinition()
    const { submitAllOrReturnFailedKey } = useChainedValidation()

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
        if (readonly) {
            return [
                <LinkButton to={organizationsOrganizationIdEdit(orgId!)} key="pageEditButton">{t("update")}</LinkButton>,
            ]
        }
        return []
    }, [readonly, orgId, organizationsOrganizationIdEdit])

    const doSubmit = useCallback(async () => {
        const errorKey = await submitAllOrReturnFailedKey()
        if (errorKey) {
            setCurrentTab(errorKey)
            return
        }
        await formState.submitForm()
    }, [formState.submitForm, submitAllOrReturnFailedKey])

    const actions = useMemo((): Action[] | undefined => {
        if (!readonly) {
            return [{
                key: "cancel",
                label: t("cancel"),
                onClick: () => navigate(-1),
                variant: "text"
            }, {
                key: "save",
                label: t("save"),
                onClick: doSubmit
            }]
        }
    }, [readonly, doSubmit])

    const userListFilters = useMemo(() => ({
        organizationId: orgId
    }), [orgId])

    const leftSectionTabs = useMemo(() => [
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
                }
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
                    {!myOrganization ? <AutomatedOrganizationFactory
                        readonly={readonly}
                        multipleRoles={false}
                        formState={formState}
                        organization={organization}
                        isLoading={isLoading}
                        fieldsOverride={fieldsOverride}
                    /> : <MyOrganization
                        readonly={readonly}
                        formState={formState}
                        organization={organization}
                        isLoading={isLoading}
                        fieldsOverride={fieldsOverride}
                        multipleRoles={false}
                    />
                    }

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
