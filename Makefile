WEB_DOCKERFILE	:= infra/docker/connect-admin-web/Dockerfile
WEB_NAME	    := smartbcity/connect-admin-web
WEB_IMG	        := ${WEB_NAME}:${VERSION}

package: docker-web

docker-web:
	@docker build --no-cache=true --build-arg CI_NPM_AUTH_TOKEN=${CI_NPM_AUTH_TOKEN} --build-arg VERSION=${VERSION} -f ${WEB_DOCKERFILE} -t ${WEB_IMG} .
	@docker push ${WEB_IMG}

## DEV ENVIRONMENT
include infra/docker-compose/dev-compose.mk