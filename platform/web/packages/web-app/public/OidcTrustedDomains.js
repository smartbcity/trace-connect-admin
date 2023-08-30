// Add bellow trusted domains, access tokens will automatically injected to be send to
// trusted domain can also be a path like https://www.myapi.com/users,
// then all subroute like https://www.myapi.com/useers/1 will be authorized to send access_token to.

// Domains used by OIDC server must be also declared here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trustedDomains = {
    default: [
        //the application root
        'http://localhost:5173', 
        //the keycloak server
        "https://auth.dev.connect.smart-b.io",
        "http://keycloak-it:8080",
        //the api
        "https://dev.connect.smart-b.io"
    ],
    config_classic: ['http://localhost:5173'],
    config_without_silent_login: ['http://localhost:5173'],
    config_without_refresh_token: ['http://localhost:5173'],
    config_without_refresh_token_silent_login: ['http://localhost:5173'],
};

// Service worker will continue to give access token to the JavaScript client
// Ideal to hide refresh token from client JavaScript, but to retrieve access_token for some
// scenarios which require it. For example, to send it via websocket connection.
trustedDomains.config_show_access_token = { domains: ['http://localhost:5173'], showAccessToken: true };

// This example defines domains used by OIDC server separately from domains to which access tokens will be injected.
trustedDomains.config_separate_oidc_access_token_domains = {
    oidcDomains: ['http://localhost:5173'],
    accessTokenDomains: ["https://auth.dev.connect.smart-b.io", "http://keycloak-it:8080"],
};
