module.exports = {
  client: {
    includes: ['src/**/*.tsx', 'src/**/*.ts'],
    tagName: 'gql',
    service: {
      name: 'clinwiki',
      url: 'http://localhost:3000/graphql',
      skipSSLValidation: true,
    },
  },
};
