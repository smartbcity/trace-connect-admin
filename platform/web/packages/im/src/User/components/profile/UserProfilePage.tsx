import { Typography } from '@mui/material'
import { Action, i2Config, Page, Section, LinkButton } from '@smartb/g2';
import { AutomatedUserFactory, MyProfile, useGetOrganizationRefs, User, userExistsByEmail, useUserFormState,UserFactoryFieldsOverride } from '@smartb/g2-i2-v2';
import { getUserRolesOptions, useChainedValidation, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { UserDomainDetails } from './UserDomainDetails';

export interface UserProfilePageProps {
    readonly: boolean
    myProfil?: boolean
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const { readonly, myProfil = false } = props
    const { t } = useTranslation();
    const [searchParams] = useSearchParams()
    const { userId } = useParams();
    const navigate = useNavigate()
    const { keycloak, service } = useExtendedAuth()
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })
    const isUpdate = !!userId || myProfil
    const { submitAllOrReturnFailedKey, generateRegisterSubmitter } = useChainedValidation()

    const organizationId = useMemo(() => {
        return searchParams.get('organizationId') ?? undefined
    }, [searchParams])

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
        if (!readonly || !user) {
            return []
        }

        return [
            <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton>
        ]
    }, [readonly, user, myProfil, usersUserIdEdit])

    const rolesOptions = useMemo(() => ({
        readonly: getUserRolesOptions(t, true),
        mutable: getUserRolesOptions(t),
    }), [t])

    const getOrganizationUrl = useCallback(
        (organizationId: string) => organizationsOrganizationIdView(organizationId),
        [organizationsOrganizationIdView],
    )

    const onSubmitAttributs = useCallback(
        async (values: Partial<User>) => {
            await formState.setValues((old) => ({ ...old, ...values }))
        },
        [],
    )

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
                onClick: async () => {
                    const errorKey = await submitAllOrReturnFailedKey()
                    if (errorKey) {
                        return
                    }
                    await formState.submitForm()
                }
            }]
        }
    }, [readonly, formState.submitForm])

    const isAdmin = useMemo(() => {
        return service.is_admin()
    }, [service.is_admin])

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
                    options: rolesOptions.mutable
                }
            },
            memberOf: {
                readonly: isUpdate,
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
                        <Typography sx={{ flexShrink: 0 }} color="primary" variant="h5" key="pageTitle">{myProfil ? t("profil") : t("users")}</Typography>,
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
                {!myProfil ? <AutomatedUserFactory
                    readonly={readonly}
                    formState={formState}
                    update={isUpdate}
                    isLoading={isLoading}
                    user={user}
                    organizationId={organizationId}
                    userId={userId}
                    resetPasswordType={isAdmin ? "forced" : undefined}
                    multipleRoles={false}
                    readonlyRolesOptions={rolesOptions.readonly}
                    getOrganizationUrl={getOrganizationUrl}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                    formExtension={<UserDomainDetails onSubmit={onSubmitAttributs} registerSubmitter={generateRegisterSubmitter("details")} readonly={readonly} isLoading={isLoading} />}
                /> :
                    <MyProfile
                        formState={formState}
                        user={user}
                        update={isUpdate}
                        readonly={readonly}
                        isLoading={isLoading}
                        readonlyRolesOptions={rolesOptions.readonly}
                        multipleRoles={false}
                        resetPasswordType='email'
                        getOrganizationUrl={getOrganizationUrl}
                        fieldsOverride={fieldsOverride}
                        checkEmailValidity={checkEmailValidity}
                        formExtension={<UserDomainDetails onSubmit={onSubmitAttributs} registerSubmitter={generateRegisterSubmitter("details")} readonly={readonly} isLoading={isLoading} />}
                    />}
            </Section>
        </Page>
    )
}
