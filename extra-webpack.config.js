/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
  config.target = 'electron-renderer';
  // Required for node-keytar to load
  config.module.rules.push({ test: /\.node$/, loader: 'node-loader' });
  return config;
};
