import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createPageStory } from "../createPageStory";

const { PageStory } = createPageStory({
    pageId: "login.ftl"
});

export default {
    title: "login/Login",
    component: PageStory,
} as ComponentMeta<typeof PageStory>;

export const Default: ComponentStory<typeof PageStory> = () => <PageStory />;

export const WithoutPasswordField: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            realm: { password: false }
        }}
    />
);

export const WithoutRegistration: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            realm: { registrationAllowed: false }
        }}
    />
);

export const WithoutRememberMe: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            realm: { rememberMe: false }
        }}
    />
);

export const WithoutPasswordReset: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            realm: { resetPasswordAllowed: false }
        }}
    />
);

export const WithEmailAsUsername: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            realm: { loginWithEmailAllowed: false }
        }}
    />
);

export const WithPresetUsername: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            login: { username: "max.mustermann@mail.com" }
        }}
    />
);

export const WithImmutablePresetUsername: ComponentStory<typeof PageStory> = () => (
    <PageStory
        kcContext={{
            login: { username: 'max.mustermann@mail.com' },
        }}
    />
);
