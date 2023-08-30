import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { useMemo, useCallback, type FormEventHandler, useState } from "react";
import { FormComposableField, useFormComposable, FormComposable, Action, validators } from "@smartb/g2";
import { useTranslation } from "react-i18next";

export default function UpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const [isLoading, setIsLoading] = useState(false)

    const { url, realm, auth, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;
    const { t } = useTranslation()

    const initialValues = useMemo(() => ({
        email: auth?.showUsername ? auth?.attemptedUsername : undefined,
    }), [auth])

    const formState = useFormComposable({
        formikConfig: {
            initialValues
        }
    })

    const fields = useMemo((): FormComposableField[] => {
        return [{
            name: "password",
            type: "textField",
            label: msgStr("passwordNew"),
            params: {
                textFieldType: "password",
            },
            validator: validators.password(t)
        },{
            name: "password-confirm",
            type: "textField",
            label: msgStr("passwordConfirm"),
            params: {
                textFieldType: "password",
            },
            validator: validators.passwordCheck(t),
        }]
    }, [realm, msgStr, t])

    const actions = useMemo((): Action[] => {
        return [...(isAppInitiatedAction ? [{
            key: "cancel",
            label: msgStr("doCancel"),
            type: "submit",
            isLoading: isLoading,
            name: "cancel-aia",
            value: "true",
            variant: "text"
        }as Action] : [] ), {
            key: "logIn",
            label: msgStr("doRegister"),
            type: "submit",
            isLoading: isLoading
        }]
    }, [isLoading, msgStr, isAppInitiatedAction])

    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const errors = await formState.validateForm()
        if (errors && Object.keys(errors).length > 0) {
            setIsLoading(false);
            return
        }

        const formElement = e.target as HTMLFormElement;

        //NOTE: Keycloak expect password-new
        formElement.querySelector("input[name='password']")?.setAttribute("name", "password-new");

        formElement.submit();
    }, [formState.validateForm]);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            headerNode={msg("updatePasswordTitle")}
        >
            <FormComposable
                fields={fields}
                formState={formState}
                actions={actions}
                action={url.loginAction}
                method="post"
                onSubmit={onSubmit}
            />
        </Template>
    );
}