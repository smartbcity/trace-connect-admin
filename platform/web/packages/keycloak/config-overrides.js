module.exports = (config) => {
  const sourceMapLoader = config.module.rules[0]
  sourceMapLoader.exclude = [/node_modules/, /(?=.*kotlin)(?=.*js).*/, /stories/, ...(Array.isArray(sourceMapLoader.exclude) ? sourceMapLoader.exclude : [sourceMapLoader.exclude])]
  config.module.rules[1].oneOf.forEach((rule) => {
    if (!!rule.test && !Array.isArray(rule.test)) {
      if (rule.test.source && rule.test.source.includes("ts")) {
        rule.include = undefined;
        rule.exclude = [/node_modules/, /(?=.*kotlin)(?=.*js).*/, /stories/, ...(rule.exclude ? Array.isArray(rule.exclude) ? rule.exclude : [rule.exclude] : [])];
      }
    }
  })
  config.module.strictExportPresence = false;
  // config.optimization.minimize = false
  return config;
};
