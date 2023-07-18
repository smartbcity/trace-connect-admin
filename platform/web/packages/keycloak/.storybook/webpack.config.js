module.exports = ({ config }) => {

  config.module.rules[5].oneOf.forEach((rule) => {
    if (!!rule.test && !Array.isArray(rule.test)) {
      if (rule.test.source && rule.test.source.includes("ts")) {
        rule.include = undefined;
        rule.exclude = [/node_modules/,  ...(rule.exclude ? Array.isArray(rule.exclude) ? rule.exclude : [rule.exclude] : [])];
      }
    }
  })
  return config;
};
