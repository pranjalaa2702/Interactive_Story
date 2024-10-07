const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "net": false,
    "querystring": require.resolve("querystring-es3"),
    "fs": false,
    "process": require.resolve("process/browser"),
    "timers": require.resolve("timers-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "assert": require.resolve("assert/"),
    "vm": require.resolve("vm-browserify"),
    "async_hooks": false,
  };

  // Prevent Webpack from bundling express and similar backend libraries
  config.externals = {
    express: 'commonjs express',
    mongoose: 'commonjs mongoose',
    // Add any other backend modules you don't want to bundle here
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
