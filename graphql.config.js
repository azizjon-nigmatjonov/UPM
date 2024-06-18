module.exports = {
  projects: {
    app: {
      schema: ['schema.graphql'],
      documents: ['src/**/*.graphql'],
      extensions: {
        endpoints: {
          default: {
            url: 'https://test.api.auth.upm.udevs.io/query',
          },
        },
        languageService: {
          // skip generated_schema.graphql file with GoTo definition
          useSchemaFileDefinitions: true,
        },
      },
    },
  },
};
