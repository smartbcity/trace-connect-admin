import { useCallback, useRef } from 'react'



export const useChainedValidation = () => {
    const submitters = useRef<Record<string, () => Promise<any>>>({})

    const submitAllOrReturnFailedKey = useCallback(
        async () => {
            for (let key in submitters.current) {
                const error = await submitters.current[key]()
                if (error) {
                    return key
                }
            }
        },
        [],
    )

    const addSubmitter = useCallback(
        (key: string, submitter: () => Promise<any>) => {
            submitters.current[key] = submitter
        },
        [],
    )


    const removeSubmitter = useCallback(
        (key: string) => {
            delete submitters.current[key]
        },
        [],
    )

    const generateRegisterSubmitter = useCallback(
        (key: string) => (submitForm: () => Promise<any>, validateForm: (values?: any) => Promise<any>) => {
            const customSubmit = async () => {
                const errors = await validateForm()
                if (errors && Object.keys(errors).length > 0) return errors
                return submitForm()
            }
            addSubmitter(key, customSubmit)
            return () => {
                removeSubmitter(key)
            }
        },
        [],
    )


    return {
        submitAllOrReturnFailedKey,
        addSubmitter,
        removeSubmitter,
        generateRegisterSubmitter
    }
}
