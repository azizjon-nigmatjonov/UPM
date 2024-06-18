
const cracoModuleFederation = require('craco-module-federation');


module.exports = {
  devServer: {
    port: 4000,
  },
  plugins: [{
      plugin: cracoModuleFederation,
      options: { useNamedChunkIds:true } //THIS LINE IS OPTIONAL
    },
  ],
  babel: {
    plugins: [
      [
        'babel-plugin-direct-import',
        { modules: ['@mui/material', '@mui/icons-material'] },
      ],
    ]
  }
}
