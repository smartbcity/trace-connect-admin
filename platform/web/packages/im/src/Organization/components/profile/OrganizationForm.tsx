import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {FormComposable, FormComposableField, FormComposableState, validators} from "@smartb/g2";
import {useOrganizationFormFields} from "@smartb/g2-i2-v2";
import {getOrgRolesOptions} from "components";

export interface OrganizationFormProps {
    isLoading : boolean
    formState : FormComposableState
    readOnly : boolean

}

export const OrganizationForm = (props: OrganizationFormProps) => {
    const {isLoading, formState, readOnly} = props
    const { t } = useTranslation();
    const rolesOptions = useMemo(() => getOrgRolesOptions(t), [t])
    const fieldsOverride = useMemo(() => {
        return {
            roles: {
                params: {
                    options: rolesOptions
                },
                validator: validators.requiredField(t)
            }
        }
    }, [t, rolesOptions])

    const fields = useOrganizationFormFields({
            formState: formState,
            fieldsOverride: fieldsOverride
    })
    const editOnlyFields: FormComposableField[] = [
        fields.fields.street,
        fields.fields.postalCode,
        fields.fields.city,
    ];

    const finalFields = useMemo((): FormComposableField[] => {
        if (readOnly) {
            return [
                {
                    ...fields.fields.name,
                    label: t("companyName"),
                },
                    fields.fields.roles
                ,
                {
                    name: "readOnlyAddress",
                    type: "textField",
                    label: t("address"),
                },
                {
                    name: "attributes.country",
                    type: "textField",
                    label: t("country"),
                },
                {
                    ...fields.fields.description,
                    fullRow: true,
                },
            ];
        } else {
            return [
                {
                    ...fields.fields.name,
                    label: t("companyName"),
                    fullRow: true,
                },
                ...editOnlyFields,
                {
                    name: "attributes.country",
                    type: "textField",
                    label: t("country"),
                },
                {
                    ...fields.fields.description,
                    fullRow: true,
                },
            ];
        }
    }, [t, fields.fields, editOnlyFields]);

    return (
        <FormComposable
            fields={finalFields}
            formState={formState}
            readOnly={readOnly}
            isLoading={isLoading}
            display="grid"
        />
    )
}