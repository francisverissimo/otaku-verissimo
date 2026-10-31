# AGENTS.md

Contexto para agentes de IA (e pessoas) que trabalham neste repositório. Mantenha este arquivo curto e
atualize-o no mesmo PR que mudar comandos, convenções ou estrutura.

## O projeto

SPA em React + Vite que consome a [API GraphQL da AniList](https://docs.anilist.co/). As páginas de anime,
personagem, staff e busca são públicas. O login usa o OAuth implícito da AniList e libera a lista de
animes do usuário, onde ele pode marcar episódios assistidos (`SaveMediaListEntry`). Hoje o app cobre
apenas anime (`type: ANIME` nas queries).

## Comandos

```bash
nvm use          # Node 26
yarn install
yarn dev         # http://localhost:9000
yarn lint
yarn build       # tsc + vite build
yarn codegen     # regenera src/gql/ a partir das queries e de schema.graphql
yarn codegen:schema  # baixa o schema atual da AniList
```

Antes de dar uma tarefa por concluída, rode `yarn lint` e `yarn build`. Ambos devem passar sem erros.
Se você mudou alguma query ou fragment, rode `yarn codegen` antes e inclua `src/gql/` no commit.

## Estrutura atual

A estrutura está em migração (veja "Trabalho em andamento").

- `src/pages/<página>/`: a página, os componentes usados só por ela e `<página>-queries.ts` (queries,
  mapeamento para o modelo de view e hooks)
- `src/components/`: componentes compartilhados
- `src/auth/`: token, viewer e URL de OAuth. Todo acesso ao token passa por `src/auth/token.ts`
- `src/contexts/`, `src/hooks/`: contexto de autenticação e `useAuth`
- `src/lib/`: cliente GraphQL (`execute`), `queryClient` e helpers de paginação
- `src/gql/`: tipos gerados pelo GraphQL Codegen (não edite à mão)
- `src/index.css`: tokens do tema do Tailwind v4 (`--color-main`, `--color-darkBG` etc.)

Detalhes da camada de dados e do fluxo de login: [`docs/architecture.md`](docs/architecture.md).

## Convenções

- Arquivos em kebab-case, componentes como named exports, imports internos com o alias `@/`.
- Formatação pelo Prettier (`prettier.config.js`, com ordenação de classes do Tailwind).
- Use as cores do tema em vez de valores soltos. Para cores de capa vindas da AniList, use
  `getContrastSafeColor`.
- Texto da interface em inglês.
- Componentes recebem o modelo de view da query (`AnimeView`, `StaffView`...), não a resposta crua da
  API. Trate os `null` da AniList no mapeamento (`toXView`), usando `compact` para listas.
- Novos documentos GraphQL usam `graphql()` de `@/gql`, ficam ao lado da página e passam por
  `execute()`. Use `{ auth: true }` só quando a requisição precisa do usuário logado.

## Regras

- HTML vindo da AniList (descrições) só é renderizado sanitizado. Use `CollapseParagraph`, que aplica o
  DOMPurify, em vez de `dangerouslySetInnerHTML` direto.
- Nunca coloque segredos em variáveis `VITE_*`: o Vite as embute no bundle.
- Não adicione dependências sem perguntar.
- Não registre o token em logs nem o exponha fora de `src/auth/`.
- Mantenha as mudanças no escopo da tarefa. Refactors fora do escopo viram sugestão, não código.

## Restrições de versão

- **TypeScript fica no 6.x.** O TypeScript 7 (compilador nativo) ainda não tem API JavaScript, e o
  `typescript-eslint` não roda com ele. Reavalie quando o `typescript-eslint` aceitar o 7.
- **React Router:** use o pacote `react-router` (o `react-router-dom` não existe mais no v8).
  `RouterProvider` vem de `react-router/dom`.

## Trabalho em andamento

Migração em etapas, uma branch por vez a partir do `main`:

1. `chore/foundation`: ESLint, Node 26, correções de bugs, remoção de código morto (concluída)
2. `chore/upgrade-stack`: React 19, React Router 8, Vite 8 e demais dependências (concluída)
3. `refactor/data-layer`: TanStack Query + GraphQL Codegen no lugar do Apollo Client
4. `refactor/feature-structure`: organização por feature, rotas aninhadas
5. `refactor/shared-components`: componentes compartilhados (imagem, card de mídia, carrossel)

Decisões de arquitetura ficam em `docs/adr/` (modelo em `0000-template.md`).
