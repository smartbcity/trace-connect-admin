window._env_ = {
  config: {
    i2: {
      orgUrl: "http://localhost:8009", //localhost, //set this if you want to have the organization module appearing in your app
      userUrl: "http://localhost:8009", //set this if you want to have the organization module appearing in your app
    },
    keycloak: {
      realm: "im-test",
      clientId: "im-test-web",
      url: "http://keycloak-it:8080"
    }
  }
};
