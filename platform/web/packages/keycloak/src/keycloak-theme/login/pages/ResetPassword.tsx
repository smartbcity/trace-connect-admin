import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { useMemo, useCallback, type FormEventHandler, useState } from "react";
import { FormComposableField, useFormComposable, FormComposable, Action, Link, validators } from "@smartb/g2";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

export default function ResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const [isLoading, setIsLoading] = useState(false)

    const { url, realm, auth } = kcContext;

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
            name: "email",
            type: "textField",
            label: msgStr("email"),
            params: {
                textFieldType: "email",
            },
            validator: validators.email(t)
        }]
    }, [realm, msgStr, t])

    const actions = useMemo((): Action[] => {
        return [{
            key: "logIn",
            label: t("resetPassword.send"),
            type: "submit",
            isLoading: isLoading
        }]
    }, [isLoading, t])

    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const errors = await formState.validateForm()
        if (errors && Object.keys(errors).length > 0) {
            setIsLoading(false);
            return
        }

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    }, [formState.validateForm]);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            headerNode={msg("emailForgotTitle")}
        >
            <Typography
                variant="body2"
            >
                {t("resetPassword.instructions")}
            </Typography>
            <Typography
                variant="body2"
            >
                {t("resetPassword.noEmailInstructions")}
            </Typography>
            <FormComposable
                fields={fields}
                formState={formState}
                actions={actions}
                action={url.loginAction}
                method="post"
                onSubmit={onSubmit}
            >
                <Typography
                    variant="caption"
                >
                    {t("resetPassword.note")}
                </Typography>
            </FormComposable>
            <Link sx={{ alignSelf: "flex-end" }} variant="body2" href={url.loginUrl}>{msgStr("backToLogin")}</Link>
        </Template>
    );
}