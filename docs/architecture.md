# Arquitetura

Mapa do sistema para quem chega ao código (pessoas e agentes). Descreve o que existe hoje; o porquê
das decisões está em [`adr/`](./adr/).

## Visão geral

SPA em React servida pela Vercel. Não há backend próprio: o navegador fala direto com a
[API GraphQL da AniList](https://docs.anilist.co/) em `https://graphql.anilist.co`.

## Rotas e pastas

```
/                     DashboardLayout ─ HomePage            features/home
/list                 DashboardLayout ─ AnimeListPage       features/anime-list  (filtro em ?q=)
/profile              DashboardLayout ─ ProfilePage         features/profile
/search               SearchPage                            features/search      (termo em ?search=)
/seasonal             SeasonalPage                          features/seasonal    (filtros na URL)
/anime/:id            AnimePage ─ AnimeOverviewTab          features/anime
/anime/:id/characters AnimePage ─ AnimeCharactersTab
/anime/:id/staff      AnimePage ─ AnimeStaffTab
/staff/:id            StaffPage                             features/staff
/character/:id        CharacterPage                         features/character
*                     NotFoundPage                          app/
```

- O router fica em `src/app/app.tsx`. `DashboardLayout` desenha a sidebar (desktop) e a bottom bar
  (mobile) em volta das páginas do dashboard.
- `AnimePage` busca o anime uma vez e repassa o modelo de view para as abas pelo outlet context
  (`useAnimeRoute()`). Trocar de aba não refaz a query.
- Links antigos `/?tabs=anime-list` e `/?tabs=profile` redirecionam para `/list` e `/profile`.
- Todas as rotas, menos a home e o layout do dashboard, usam `lazy`: o código de cada página é baixado
  na primeira vez que ela é aberta.
- `RouteErrorBoundary` envolve todas as rotas. Depois de um deploy, uma aba aberta pode pedir um chunk
  que não existe mais; nesse caso a página recarrega uma vez (no máximo a cada 10 s) para buscar o build
  novo. Outros erros mostram o `ErrorFallback`.

## Camada de dados

```
componente ─► hook da página (useAnime, useStaff...) ─► TanStack Query ─► execute() ─► AniList
                    │
                    └─ select: resposta crua ─► modelo de view (sem nulls soltos)
```

- **Queries** ficam na pasta da feature que as usa, em `src/features/<feature>/<feature>-queries.ts`. Cada
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

## Seasonal Chart

Lista todos os animes de uma temporada, agrupados por formato na ordem do AL-chan (TV, TV Short,
Movie, OVA, ONA, Special, Music).

- `useSeasonalChart` busca todas as páginas da temporada de uma vez (50 por página, normalmente 2 ou 3
  requisições). Com a lista completa, o agrupamento por formato e o filtro por gênero acontecem no
  navegador, sem novas requisições.
- Ano, temporada, ordenação, ordem, gêneros, "na minha lista" e conteúdo adulto ficam na URL
  (`seasonal-filters.ts`). Só os valores diferentes do padrão aparecem nela.
- Gêneros não vão para a API e não entram na chave do cache: trocar de gênero não refaz a busca.
- Logado, a query envia o token para trazer o `mediaListEntry` de cada anime. "Add to Planning" salva a
  entrada, atualiza o card no cache e invalida a lista do usuário (`queryKeys.mediaList`).
- `isAdult: false` esconde conteúdo adulto. Para mostrar, a variável é omitida, porque `isAdult: true`
  traria só conteúdo adulto.

## Entrada da lista na página do anime

Logado, a página do anime mostra o status do anime na lista do usuário (ou "Add to list") e um botão
"+1 EP". O status abre o editor (`anime-list-entry-dialog.tsx`) com status, episódios, nota, datas,
rewatches, notas, privado e remoção (com confirmação).

- `useAnimeListEntry` busca a entrada e o formato de nota do usuário (`scoreFormat`), que define o
  intervalo e o passo do campo de nota.
- `applyFormRules` (`anime-list-entry-utils.ts`) segue as regras da AniList: chegar ao último episódio
  completa a entrada; passar para Watching preenche a data de início; passar para Completed preenche o
  progresso e a data de fim. Datas já preenchidas não são sobrescritas.
- Salvar ou remover atualiza a entrada no cache e invalida a lista do usuário e o Seasonal Chart, para
  que as três telas mostrem o mesmo estado.

## Autenticação

Fluxo OAuth implícito da AniList:

1. O link de login (`ANILIST_AUTH_URL`) leva à AniList.
2. A AniList redireciona para a redirect URL cadastrada no client, com `#access_token=...` na URL.
3. `resolveViewer()` (`src/features/auth/viewer.ts`) lê o token do fragmento, guarda no `localStorage` e busca
   o usuário (`Viewer`). O usuário fica em cache no `localStorage` por uma hora.
4. `AuthContext` expõe `user`: `undefined` enquanto resolve, `null` sem login, ou o usuário.

Cada ambiente precisa do próprio client na AniList, porque a redirect URL é fixa por client (veja o
README).

## Lista do usuário

`anime-list-queries.ts` busca a `MediaListCollection` e expõe `useSaveMediaListEntry`. Depois de salvar,
`applySavedEntry` (`anime-list-utils.ts`) atualiza o cache local: muda o progresso e, se o status mudou, move a
entrada de lista. Listas personalizadas (`status: null`) repetem entradas das listas de status e
recebem a atualização também.
