# Arquitetura

Mapa do sistema para quem chega ao código (pessoas e agentes). Descreve o que existe hoje; o porquê
das decisões está em [`adr/`](./adr/).

## Visão geral

SPA em React servida pela Vercel. Não há backend próprio: o navegador fala direto com a
[API GraphQL da AniList](https://docs.anilist.co/) em `https://graphql.anilist.co`.

## Camada de dados

```
componente ─► hook da página (useAnime, useStaff...) ─► TanStack Query ─► execute() ─► AniList
                    │
                    └─ select: resposta crua ─► modelo de view (sem nulls soltos)
```

- **Queries** ficam ao lado da página que as usa, em `src/pages/<página>/<página>-queries.ts`. Cada
  arquivo define o documento com `graphql()`, a função de mapeamento (`toXView`) e os hooks.
- **Fragments** compartilhados ficam com o componente que os consome, por exemplo
  `src/components/media-cover-card-fragment.ts` (card de capa usado na home e na busca).
- **Tipos** são gerados em `src/gql/` por `yarn codegen`, a partir de `schema.graphql`. Não edite
  `src/gql/` à mão.
- **`src/lib/graphql-client.ts`** (`execute`) faz o `fetch`, envia o token só com `{ auth: true }` e
  lança `AniListError` com o status HTTP.
- **`src/lib/query-client.ts`** define o cache: dados ficam frescos por 5 minutos; erros 4xx não são
  repetidos.
- **Paginação:** `useInfiniteQuery` + `LoadMoreTrigger` (IntersectionObserver). A primeira página vem
  na query principal e entra como `initialData`; `src/lib/connection-page.ts` converte connections da
  AniList em `{ items, nextPage }`.

## Autenticação

Fluxo OAuth implícito da AniList:

1. O link de login (`ANILIST_AUTH_URL`) leva à AniList.
2. A AniList redireciona para a redirect URL cadastrada no client, com `#access_token=...` na URL.
3. `resolveViewer()` (`src/auth/viewer.ts`) lê o token do fragmento, guarda no `localStorage` e busca
   o usuário (`Viewer`). O usuário fica em cache no `localStorage` por uma hora.
4. `AuthContext` expõe `user`: `undefined` enquanto resolve, `null` sem login, ou o usuário.

Cada ambiente precisa do próprio client na AniList, porque a redirect URL é fixa por client (veja o
README).

## Lista do usuário

`anime-list-queries.ts` busca a `MediaListCollection` e expõe `useSaveMediaListEntry`. Depois de salvar,
`applySavedEntry` (`utils.ts`) atualiza o cache local: muda o progresso e, se o status mudou, move a
entrada de lista. Listas personalizadas (`status: null`) repetem entradas das listas de status e
recebem a atualização também.
