import { Stack } from '@mui/material'
import { FormComposable, FormComposableField, useFormComposable } from '@smartb/g2'
import { Organization } from "@smartb/g2-i2-v2"
import { useEffect, useMemo } from 'react'


export interface OrganizationDomainDetailsProps {
    isLoading?: boolean
    readonly?: boolean
    onSubmit: (values: Partial<Organization>) => void
    registerSubmitter: (submitForm: () => Promise<any>, validateForm: (values?: any) => Promise<any>) => () => void
    hidden?: boolean
}

export const OrganizationDomainDetails = (props: OrganizationDomainDetailsProps) => {
    const {readonly, onSubmit, isLoading, registerSubmitter, hidden = false } = props

    const formState = useFormComposable({
        onSubmit: onSubmit
    })

    const fields = useMemo((): FormComposableField[] => [{
        name: "example",
        type: "textField",
        label: "This is an example",
        // validator: (value) => requiredString("this field is required", value)
    }], [])

    useEffect(registerSubmitter(formState.submitForm, formState.validateForm), [formState.submitForm, formState.validateForm])
    

    return (
        <Stack
            gap={3}
            display={hidden ? "none" : "flex"}
        >
            <FormComposable fields={fields} formState={formState} readonly={readonly} isLoading={isLoading} />
        </Stack>
    )
}
