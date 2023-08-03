FROM node:16-alpine as build

WORKDIR /app

COPY platform/web ./

ARG VERSION
ENV REACT_APP_VERSION=$VERSION

ARG CI_NPM_AUTH_TOKEN
RUN echo -e "\
access=public \n\
 @smartb:registry=https://gitlab.smartb.city/api/v4/projects/127/packages/npm/ \n\
//gitlab.smartb.city/api/v4/projects/127/packages/npm/:_authToken=${CI_NPM_AUTH_TOKEN} \n\
" > .npmrc

RUN yarn install
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn workspace keycloak build-keycloak-theme

FROM smartbcity/i2-keycloak:0.16.0

WORKDIR /app

ENV KC_DB=postgres
ENV KC_PROXY=none
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME=localhost
ENV KC_HTTP_RELATIVE_PATH=/


COPY --from=build /app/packages/keycloak/build_keycloak/target/*.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "--spi-login-protocol-openid-connect-legacy-logout-redirect-uri=true", "start"]
