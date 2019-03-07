module.exports = {
  client: {
    includes: ['app/**/*.tsx', 'app/**/*.ts'],
    tagName: 'gql',
    service: {
      name: 'clinwiki',
      url: 'http://localhost:3000/graphql',
      skipSSLValidation: true,
    },
  },
};
