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
```

Antes de dar uma tarefa por concluída, rode `yarn lint` e `yarn build`. Ambos devem passar sem erros.

## Estrutura atual

A estrutura está em migração (veja "Trabalho em andamento").

- `src/pages/<página>/`: a página e os componentes usados só por ela
- `src/components/`: componentes compartilhados
- `src/auth/`: token, viewer e URL de OAuth. Todo acesso ao token passa por `src/auth/token.ts`
- `src/contexts/`, `src/hooks/`: contexto de autenticação e `useAuth`
- `src/lib/queries/`, `src/lib/mutations/`: documentos GraphQL (Apollo `gql`)
- `src/types/`: tipos escritos à mão para as respostas da API
- `src/index.css`: tokens do tema do Tailwind v4 (`--color-main`, `--color-darkBG` etc.)

## Convenções

- Arquivos em kebab-case, componentes como named exports, imports internos com o alias `@/`.
- Formatação pelo Prettier (`prettier.config.js`, com ordenação de classes do Tailwind).
- Use as cores do tema em vez de valores soltos. Para cores de capa vindas da AniList, use
  `getContrastSafeColor`.
- Texto da interface em inglês.

## Regras

- HTML vindo da AniList (descrições) só é renderizado sanitizado. Use `CollapseParagraph`, que aplica o
  DOMPurify, em vez de `dangerouslySetInnerHTML` direto.
- Nunca coloque segredos em variáveis `VITE_*`: o Vite as embute no bundle.
- Não adicione dependências sem perguntar.
- Não registre o token em logs nem o exponha fora de `src/auth/`.
- Mantenha as mudanças no escopo da tarefa. Refactors fora do escopo viram sugestão, não código.

## Trabalho em andamento

Migração em etapas, uma branch por vez a partir do `main`:

1. `chore/foundation`: ESLint, Node 26, correções de bugs, remoção de código morto
2. `chore/upgrade-stack`: React 19, React Router 7, Vite e demais dependências
3. `refactor/data-layer`: troca do Apollo Client por TanStack Query + GraphQL Codegen (decidido)
4. `refactor/feature-structure`: organização por feature, rotas aninhadas
5. `refactor/shared-components`: componentes compartilhados (imagem, card de mídia, carrossel)

Decisões de arquitetura serão registradas em `docs/adr/`.
