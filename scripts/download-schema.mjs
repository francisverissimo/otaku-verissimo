// Downloads the AniList GraphQL schema into schema.graphql, which `yarn codegen` reads.
// Run it when AniList changes its API: `yarn codegen:schema && yarn codegen`.
import { writeFileSync } from 'node:fs'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

const response = await fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
})

const { data, errors } = await response.json()

if (!data) {
  throw new Error(`Introspection failed: ${JSON.stringify(errors)}`)
}

writeFileSync(new URL('../schema.graphql', import.meta.url), printSchema(buildClientSchema(data)) + '\n')
console.log('schema.graphql updated')
