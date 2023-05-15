WEB_DOCKERFILE	:= infra/docker/connect-admin-web/Dockerfile
WEB_NAME	    := smartbcity/connect-admin-web
WEB_IMG	        := ${WEB_NAME}:${VERSION}

package: package-web

package-web:
	@docker build --no-cache=true --build-arg VERSION=${VERSION} -f ${WEB_DOCKERFILE} -t ${WEB_IMG} .
	@docker push ${WEB_IMG}

