import { Typography } from '@mui/material'
import { Action, i2Config, Page, Section, LinkButton, validators } from '@smartb/g2';
import { UserFactory, useGetOrganizationRefs, userExistsByEmail, useUserFormState,UserFactoryFieldsOverride } from '@smartb/g2-i2-v2';
import { OrgRoles, getUserRolesOptions, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export interface UserProfilePageProps {
    readOnly: boolean
    myProfil?: boolean
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const { readOnly, myProfil = false } = props
    const { t } = useTranslation();
    const [searchParams] = useSearchParams()
    const { userId } = useParams();
    const navigate = useNavigate()
    const { keycloak, service } = useExtendedAuth()
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })
    const isUpdate = !!userId || myProfil

    const isAdmin = useMemo(() => {
        return service.isAdmin()
    }, [service.isAdmin()])


    const isSuperAdmin = useMemo(() => {
        return service.is_super_admin()
    }, [service.is_super_admin()])

    const organizationId = useMemo(() => {
        return searchParams.get('organizationId') ?? service.getUser()?.memberOf
    }, [searchParams, service.getUser])

    const { usersUserIdView, usersUserIdEdit, organizationsOrganizationIdView } = useRoutesDefinition()

    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(usersUserIdView(data.id))
        },
        [navigate, usersUserIdView]
    )

    const { formState, isLoading, user } = useUserFormState({
        createUserOptions: {
            onSuccess: onSave,
        },
        updateUserOptions: {
            onSuccess: onSave,
        },
        userId,
        update: isUpdate,
        myProfile: myProfil,
        multipleRoles: false,
        organizationId
    })

    const headerRightPart = useMemo(() => {
        if (!readOnly || !user) {
            return []
        }

        return [
            <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton>
        ]
    }, [readOnly, user, myProfil, usersUserIdEdit])

    const rolesOptions = useMemo(() => {
        const org = getOrganizationRefs.query.data?.items.find((org) => org.id === formState.values.memberOf)
        return {
            withSuperAdmin: getUserRolesOptions(t, org?.roles[0] as OrgRoles, true),
            rolesBasic: getUserRolesOptions(t, org?.roles[0] as OrgRoles, formState.values.memberOf),
        }
    }, [t, formState.values.memberOf, getOrganizationRefs.query.data?.items])
    const getOrganizationUrl = useCallback(
        (organizationId: string) => organizationsOrganizationIdView(organizationId),
        [organizationsOrganizationIdView],
    )

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

    const organizationOptions = useMemo(() => getOrganizationRefs.query.data?.items.map((ref) => ({ key: ref.id, label: ref.name })), [getOrganizationRefs])

    const checkEmailValidity = useCallback(
        async (email: string) => {
            return userExistsByEmail(email, i2Config().userUrl, keycloak.token)
        },
        [keycloak.token]
    )

    const fieldsOverride = useMemo((): UserFactoryFieldsOverride => {
        return {
            roles: {
                params: {
                    options: isSuperAdmin ? rolesOptions.withSuperAdmin : rolesOptions.rolesBasic
                },
                validator: validators.requiredField(t)
            },
            memberOf: {
                readOnly: !service.is_super_admin() || isUpdate,
                params: {
                    options: organizationOptions
                }
            }
        }
    }, [t, rolesOptions, isUpdate, organizationOptions])

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography sx={{ flexShrink: 0 }} variant="h5" key="pageTitle">{myProfil ? t("profil") : t("users")}</Typography>,
                    ],
                    rightPart: headerRightPart
                }]
            }}
            bottomActionsProps={{
                actions: actions
            }}
        >
            <Section sx={{
                width: "100%",
                gap: (theme) => theme.spacing(2),
            }}>
                <UserFactory
                    readOnly={readOnly}
                    formState={formState}
                    update={isUpdate}
                    isLoading={isLoading}
                    user={user}
                    organizationId={organizationId}
                    userId={userId}
                    resetPasswordType={myProfil ?'email' : isAdmin ? "forced" : undefined}
                    multipleRoles={false}
                    readOnlyRolesOptions={rolesOptions.withSuperAdmin}
                    getOrganizationUrl={getOrganizationUrl}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                /> 
            </Section>
        </Page>
    )
}
