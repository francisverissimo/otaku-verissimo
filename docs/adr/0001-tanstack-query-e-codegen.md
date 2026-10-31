# 0001. TanStack Query e GraphQL Codegen no lugar do Apollo Client

- **Status:** aceita
- **Data:** 2026-10-30
- **Etapa:** `refactor/data-layer`

## Contexto

O app usava Apollo Client 3 com tipos escritos à mão em `src/types/`. Três problemas apareceram ao
retomar o projeto:

- Os tipos manuais não batiam com a API. No schema da AniList quase todo campo pode ser `null`, mas os
  tipos diziam `string`/`number`. Isso escondeu bugs reais (por exemplo, a página de personagem quebrava
  quando não havia mídia).
- O app quase só lê dados. A única escrita é o "+1 EP" da lista do usuário. O cache normalizado do
  Apollo exigia ~40 linhas de `cache.modify` para mover uma entrada entre listas.
- A paginação (`fetchMore` + `typePolicies`) estava comentada em todo o app e não funcionava.

O Apollo 3 também passou a avisar sobre APIs removidas no Apollo 4, então manter o Apollo significava
uma migração de qualquer forma.

Um spike na página de personagem (branch `spike/tanstack-query-codegen`) mostrou as duas opções lado a
lado antes da decisão.

## Decisão

- **GraphQL Codegen** (client preset, `documentMode: 'string'`) gera os tipos das queries a partir de
  `schema.graphql`, que fica versionado.
- **TanStack Query** faz cache e estado das requisições. As requisições passam por um `fetch` próprio
  (`src/lib/graphql-client.ts`).
- Cada query mapeia a resposta para um **modelo de view** (`toAnimeView`, `toStaffView` etc.) no `select`.
  Os componentes não leem a resposta crua da API: os `null` são tratados uma vez, no mapeamento.
- Listas paginadas usam `useInfiniteQuery`; a primeira página vem junto da query principal
  (`initialData`) para não repetir a requisição.
- A mutation da lista atualiza o cache com `setQueryData` + `applySavedEntry`, sem refazer a query.

## Alternativas consideradas

- **Manter o Apollo e só adicionar o Codegen.** Resolveria os tipos, mas manteria o `cache.modify`, a
  configuração de paginação por `typePolicies` e a migração obrigatória para o Apollo 4.
- **Codegen com `fragmentMasking`.** Isola melhor os dados de cada componente, mas exige `useFragment`
  em toda leitura. Desligado por enquanto para manter os componentes simples.

## Consequências

- O bundle de produção caiu de 830 kB para 689 kB (gzip: 251 kB para 210 kB).
- O cache não é normalizado: a mesma mídia em duas queries são duas cópias. Para este app isso não é
  um problema, porque a única escrita afeta uma única query (a lista do usuário).
- Toda mudança em uma query exige `yarn codegen`. Mudanças na API da AniList exigem
  `yarn codegen:schema` antes.
- Erros 4xx da AniList (como "Not Found") não são repetidos; 429 e 5xx são repetidos até duas vezes.
- Queries públicas não enviam o token, como já acontecia com o Apollo. Só as requisições com
  `{ auth: true }` (usuário, lista e mutation) enviam.
