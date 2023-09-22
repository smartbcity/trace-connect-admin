import { Action } from '@smartb/g2'
import { useRoutesDefinition } from 'components'
import { Organization, useOrganizationFormState } from 'connect-im'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { OrgStatusValues } from './OrganizationForm'

export interface useOrganizationFunctionnalitiesProps {
    organizationId?: string
    isUpdate?: boolean
    myOrganization?: boolean
}

export const useOrganizationFunctionnalities = (params?: useOrganizationFunctionnalitiesProps) => {
    const {organizationId, isUpdate = false, myOrganization = false} = params ?? {}
    const { t } = useTranslation();

    const navigate = useNavigate()
    const { organizationsOrganizationIdView } = useRoutesDefinition()

    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(organizationsOrganizationIdView(data.id))
        },
        [navigate, organizationsOrganizationIdView],
    )

    const readOnlyAddress = useCallback(
        (organization?: Organization) => ({ 
            readOnlyAddress: organization?.address?.street !== "" ? `${organization?.address?.street}, ${organization?.address?.postalCode} ${organization?.address?.city}` : undefined,
            status: organization?.status ?? OrgStatusValues.pending()
        }),
        []
    );

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
        multipleRoles: true,
        extendInitialValues: readOnlyAddress,
    })

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
    }, [formState.submitForm])

    return {
        formState,
        isLoading,
        organization,
        formActions
    }
}
