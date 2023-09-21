FROM node:16-alpine as build

WORKDIR /app

COPY platform/web ./

ARG CI_NPM_AUTH_TOKEN
RUN echo -e "\
access=public \n\
 @smartb:registry=https://gitlab.smartb.city/api/v4/projects/127/packages/npm/ \n\
//gitlab.smartb.city/api/v4/projects/127/packages/npm/:_authToken=${CI_NPM_AUTH_TOKEN} \n\
" > .npmrc

ARG VERSION
ENV VITE_APP_VERSION=$VERSION
RUN yarn install
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn workspace web-app build

FROM nginx:1.25.1-alpine

COPY --from=build /app/packages/web-app/dist /var/www
COPY infra/docker/connect-admin-web/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
