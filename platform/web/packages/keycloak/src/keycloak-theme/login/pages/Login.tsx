// ejected using 'npx eject-keycloak-page'
import { useMemo, useCallback } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { FormComposableField, useFormComposable, FormComposable, Action, Link } from "@smartb/g2";
import { postForm } from "../../keycloakRequest";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, } = props;

    const { social, realm, url, usernameEditDisabled, login, registrationDisabled, auth } = kcContext;

    const { msg, msgStr } = i18n;

    const submitForm = useCallback(
        (values: any) => {
            postForm(url.loginAction, { username: values.email, ...values })
        },
        [url.loginAction],
    )

    const initialValues = useMemo(() => ({
        ...login,
        email: login.username,
        credentialId: auth?.selectedCredential
    }), [login, realm, auth?.selectedCredential])

    const formState = useFormComposable({
        onSubmit: submitForm,
        formikConfig: {
            initialValues
        }
    })

    const fields = useMemo((): FormComposableField[] => {
        const loginName = !realm.loginWithEmailAllowed
            ? "username"
            : realm.registrationEmailAsUsername
                ? "email"
                : "usernameOrEmail";
        return [{
            name: loginName === "usernameOrEmail" ? "username" : loginName,
            type: "textField",
            label: msgStr(loginName),
            params: {
                textFieldType: loginName === "email" ? "email" : undefined,
                disabled: usernameEditDisabled,
            }
        }, {
            name: "password",
            type: "textField",
            label: msgStr("password"),
            params: {
                textFieldType: "password"
            }
        }, ...(realm.rememberMe && !usernameEditDisabled ? [{
            name: "rememberMe",
            type: "checkBox",
            label: msgStr("rememberMe"),
        } as FormComposableField] : [])]
    }, [realm, msgStr, usernameEditDisabled])

    const actions = useMemo((): Action[] => {
        return [{
            key: "logIn",
            label: msgStr("doLogIn"),
            onClick: formState.submitForm
        }]
    }, [])

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
            infoNode={
                realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled && (
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}
                            <a tabIndex={6} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                )
            }
        >
            <FormComposable
                fields={fields}
                formState={formState}
                actions={actions}
            />
            {realm.resetPasswordAllowed &&
                <Link sx={{ alignSelf: "center" }} variant="caption" href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</Link>
            }
        </Template>
    );
}
