import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache({
    typePolicies: {
      Page: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming)
        },
      },
    },
  }),
})
