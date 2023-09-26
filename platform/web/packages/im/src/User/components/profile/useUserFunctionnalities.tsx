import { getUserRolesOptions, useExtendedAuth, useRoutesDefinition } from 'components';
import { UserFactoryFieldsOverride, useGetOrganizationRefs, useUserFormState, userExistsByEmail } from 'connect-im';
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePolicies } from '../../../Policies/usePolicies';
import { Action, i2Config, validators } from '@smartb/g2';

interface UseUserFunctionnalitiesParams {
    organizationId?: string
    userId?: string
    isUpdate?: boolean
    myProfile?: boolean
    readonly?: boolean
}

export const useUserFunctionnalities = (params?: UseUserFunctionnalitiesParams) => {
    const { isUpdate = false, myProfile = false, organizationId, userId, readonly = false } = params ?? {}
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const { keycloak, roles } = useExtendedAuth()
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })
    const frontPolicies = usePolicies({ myProfile: myProfile })

    const { usersUserIdView, organizationsOrganizationIdView } = useRoutesDefinition()
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
        myProfile: myProfile,
        multipleRoles: false,
        organizationId
    })

    const rolesOptions = useMemo(() => {
        const org = getOrganizationRefs.query.data?.items.find((org) => org.id === formState.values.memberOf)
        const orgRole = roles?.find((role: any) => role.identifier === org?.roles[0])
        return getUserRolesOptions(i18n.language, orgRole, roles)
    }, [i18n.language, t, getOrganizationRefs.query.data?.items, formState.values.memberOf, roles])

    const getOrganizationUrl = useCallback(
        (organizationId: string) => organizationsOrganizationIdView(organizationId),
        [organizationsOrganizationIdView],
    )

    useEffect(() => {
        if (!isUpdate && !readonly) formState.setFieldValue('roles', undefined)
    }, [formState.values.memberOf, isUpdate, readonly])

    const formActions = useMemo((): Action[] | undefined => {
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
    }, [ formState.submitForm])

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

    return {
        formState, 
        isLoading, 
        user,
        checkEmailValidity,
        fieldsOverride,
        formActions,
        getOrganizationUrl
    }
}
