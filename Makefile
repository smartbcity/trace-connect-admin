WEB_DOCKERFILE	:= infra/docker/connect-admin-web/Dockerfile
WEB_NAME	    := smartbcity/connect-admin-web
WEB_IMG	        := ${WEB_NAME}:${VERSION}

KEYCLOAK_DOCKERFILE_DEV	:= infra/docker/keycloak-dev/Dockerfile
KEYCLOAK_DOCKERFILE	    := infra/docker/keycloak/Dockerfile
KEYCLOAK_NAME	   	 	:= smartbcity/connect-admin-keycloak
KEYCLOAK_IMG	    	:= ${KEYCLOAK_NAME}:${VERSION}

package: docker-web

docker-web:
	@docker build --no-cache=true --build-arg CI_NPM_AUTH_TOKEN=${CI_NPM_AUTH_TOKEN} --build-arg VERSION=${VERSION} -f ${WEB_DOCKERFILE} -t ${WEB_IMG} .
	@docker push ${WEB_IMG}

package-keycloak:
	@docker build --no-cache=true --progress=plain --build-arg CI_NPM_AUTH_TOKEN=${CI_NPM_AUTH_TOKEN} --build-arg VERSION=${VERSION} -f ${KEYCLOAK_DOCKERFILE} -t ${KEYCLOAK_IMG} .
	@docker push ${KEYCLOAK_IMG}

package-keycloak-dev:
	@docker build --no-cache=true --progress=plain --build-arg VERSION=${VERSION} -f ${KEYCLOAK_DOCKERFILE_DEV} -t ${KEYCLOAK_IMG} .


## DEV ENVIRONMENT
include infra/docker-compose/dev-compose.mk