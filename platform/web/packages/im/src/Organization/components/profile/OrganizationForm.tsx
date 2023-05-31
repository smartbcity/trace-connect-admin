import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {FormComposable, FormComposableField, FormComposableState} from "@smartb/g2";
import {useOrganizationFormFields} from "@smartb/g2-i2-v2";

export interface OrganizationFormProps {
    isLoading : boolean
    formState : FormComposableState
    readOnly : boolean

}

export const OrganizationForm = (props: OrganizationFormProps) => {
    const {isLoading, formState, readOnly} = props
    const { t } = useTranslation();
    //const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])
    /*const fieldsOverride = useMemo(() => {
        return {
            roles: {
                params: {
                    options: rolesOptions
                },
                validator: validators.requiredField(t)
            }
        }
    }, [t, rolesOptions])*/

    const fields = useOrganizationFormFields({
            formState: formState
    })

    const readonlyFields = useMemo((): FormComposableField[] => [{
        name: "name",
        type: "textField",
        label: t("companyName"),
        fullRow: true
    },{
        name: "readOnlyAddress",
        type: "textField",
        label: t("address"),
        defaultValue: `${formState.initialValues.street}, ${formState.initialValues.postalCode} ${formState.initialValues.city}`
    },{
        name: "attributes.country",
        type: "textField",
        label: t("country"),
        defaultValue: formState.initialValues.attributes.country
    },{
        name: "description",
        type: "textField",
        label: t("description"),
        fullRow: true
    }
    ], [t])

    return (
        <FormComposable
            fields={!readOnly ? fields.fieldsArray : readonlyFields}
            formState={formState}
            readOnly={readOnly}
            isLoading={isLoading}
            display="grid"
        />
    )
}