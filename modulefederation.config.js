const deps = require("./package.json").dependencies;

module.exports = {
  name: "upm_host",
  exposes: {},
  remotes: {
    fileSystem: process.env.REACT_APP_FILESYSTEM_SERVICE_URL,
  },
  filename: "remoteEntry.js",
  shared: {
    ...deps,
    react: {
      eager: true,
      singleton: true,
      requiredVersion: deps["react"],
    },
    "react-dom": {
      eager: true,
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
    'react-use-keypress': {
      eager: true,
      singleton: true,
      requiredVersion: deps['react-use-keypress']
    }
  },
};