import { Action, i2Config, Page, Section, LinkButton, validators, Button } from '@smartb/g2';
import { UserFactory, useGetOrganizationRefs, userExistsByEmail, useUserFormState, UserFactoryFieldsOverride, useUserDisable, User } from 'connect-im';
import { LanguageSelector, PageHeaderObject, getUserRolesOptions, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePolicies } from "../../../Policies/usePolicies";
import { Box } from "@mui/material"
import { useDeleteUserPopUp } from '../../hooks/useDeleteUserPopUp';
import { useQueryClient } from '@tanstack/react-query';

export interface UserProfilePageProps {
    readOnly: boolean
    myProfil?: boolean
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const { readOnly, myProfil = false } = props
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams()
    const { userId } = useParams();
    const navigate = useNavigate()
    const { keycloak, service, roles, policies } = useExtendedAuth()
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })
    const isUpdate = !!userId || myProfil
    const frontPolicies = usePolicies({ myProfil: myProfil })
    const isAdmin = service.is_im_user_write()
    const queryClient = useQueryClient()
    const { usersUserIdView, usersUserIdEdit, organizationsOrganizationIdView, users } = useRoutesDefinition()


    const userDisable = useUserDisable({
    })

    const onDeleteClick = useCallback(
        async (user: User) => {
            const result = await userDisable.mutateAsync({
                id: user.id,
                anonymize: true
            })
            queryClient.invalidateQueries({ queryKey: ["userRefList"] })
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["user"] })
            if (result) {
                navigate(users())
            }
        }, [queryClient.invalidateQueries, users]
    )

    const {popup, open } = useDeleteUserPopUp({
        onDeleteClick
    })

    const organizationId = useMemo(() => {
        return searchParams.get('organizationId') ?? service.getUser()?.memberOf
    }, [searchParams, service.getUser])

    

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
             //@ts-ignore
            policies.user.canDelete(user) ? <Button onClick={() => open(user)} color="error" key="deleteButton">{t("delete")}</Button> : undefined,
             //@ts-ignore
            policies.user.canUpdate(user) ? <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
        ]
    }, [readOnly, user, myProfil, usersUserIdEdit, open, userId, policies.user])

    const rolesOptions = useMemo(() => {
        const org = getOrganizationRefs.query.data?.items.find((org) => org.id === formState.values.memberOf)
        const orgRole = roles?.find((role: any) => role.identifier === org?.roles[0])
        return getUserRolesOptions(i18n.language, orgRole, roles)
    }, [i18n.language, t, getOrganizationRefs.query.data?.items, formState.values.memberOf, roles])

    const getOrganizationUrl = useCallback(
        (organizationId: string) => organizationsOrganizationIdView(organizationId),
        [organizationsOrganizationIdView],
    )

    const actions = useMemo((): Action[] | undefined => {
        //@ts-ignore
        if (!readOnly && ((isUpdate && user &&  policies.user.canUpdate(user)) || (!isUpdate && policies.user.canCreate(organizationId)))) {
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
    }, [readOnly, formState.submitForm, user, isUpdate, organizationId])

    const organizationOptions = useMemo(() =>
        getOrganizationRefs.query.data?.items.map(
            (ref) => ({ key: ref.id, label: ref.name })
        ), [getOrganizationRefs])

    const checkEmailValidity = useCallback(
        async (email: string) => {
            return userExistsByEmail(email, i2Config().url, keycloak.token)
        },
        [keycloak.token]
    )

    const fieldsOverride = useMemo((): UserFactoryFieldsOverride => {
        return {
            roles: {
                params: {
                    options: rolesOptions,
                    disabled: !isUpdate && !formState.values.memberOf
                },
                readOnly: isUpdate && !frontPolicies.user.canUpdateRole,
                validator: validators.requiredField(t)
            },
            memberOf: {
                readOnly: isUpdate || !frontPolicies.user.canUpdateOrganization,
                params: {
                    options: organizationOptions
                }
            }
        }
    }, [t, rolesOptions, isUpdate, organizationOptions, frontPolicies.user, formState.values.memberOf])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myProfil ? t("profil") : t("users"),
                titleProps: { sx: { flexShrink: 0 } },
                rightPart: headerRightPart
            })}
            bottomActionsProps={{
                actions: actions
            }}
        >
            <Section sx={{
                width: "100%",
                gap: (theme) => theme.spacing(2),
                position: "relative"
            }}>
                {myProfil && <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        right: "15px"
                    }}
                >
                    <LanguageSelector />
                </Box>}
                <UserFactory
                    readOnly={readOnly}
                    formState={formState}
                    update={isUpdate}
                    isLoading={isLoading}
                    user={user ?? undefined}
                    organizationId={organizationId}
                    userId={userId}
                    resetPasswordType={myProfil ? 'email' : isAdmin ? "forced" : undefined}
                    multipleRoles={false}
                    getOrganizationUrl={getOrganizationUrl}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                />
            </Section>
           {popup}
        </Page>
    )
}
