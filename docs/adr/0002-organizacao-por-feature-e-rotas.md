# 0002. Organização por feature e rotas aninhadas

- **Status:** aceita
- **Data:** 2026-10-31
- **Etapa:** `refactor/feature-structure`

## Contexto

As pastas misturavam dois critérios: por tipo (`components/`, `hooks/`, `utils/`, `contexts/`, `auth/`)
e por página (`pages/`). Uma feature como a lista do usuário ficava espalhada entre
`pages/dashboard/tabs/anime-list/`, um contexto global montado em `main.tsx` e utilitários em `utils/`.

A navegação também não usava o router:

- As abas do dashboard eram `?tabs=anime-list` e `?tabs=profile`, trocadas com `setSearchParams`.
- As abas do anime (overview, characters, staff) eram estado local. O botão voltar do navegador saía
  da página em vez de voltar para a aba anterior, e não dava para compartilhar o link de uma aba.
- O filtro da lista ficava num contexto React que envolvia o app inteiro, só para guardar uma string.

## Decisão

- **`src/features/<feature>/`** reúne a página, os componentes usados só por ela e as queries.
  `src/components/` fica para o que mais de uma feature usa; `src/lib/` para código sem UI.
- **Uma feature não importa outra**, exceto `auth`. Se duas features precisarem do mesmo código, ele
  sobe para `components/` ou `lib/`.
- **`src/app/`** guarda o router, o layout do dashboard e a navegação.
- **Rotas aninhadas:** `/list`, `/profile` dentro de um layout com a navegação; `/anime/:id/characters`
  e `/anime/:id/staff` como rotas filhas de `AnimePage`, que repassa o anime pelo outlet context.
- **Estado de navegação na URL:** o filtro da lista virou `/list?q=`.
- Os links antigos com `?tabs=` redirecionam para as rotas novas.

## Alternativas consideradas

- **Manter `pages/` e só mover os arquivos soltos.** Menos arquivos mudariam, mas a lista e a auth
  continuariam espalhadas em pastas por tipo.
- **Buscar o anime em cada aba.** Funcionaria com o cache do TanStack Query, mas o outlet context deixa
  explícito que as abas mostram o mesmo anime da página.

## Consequências

- Para entender uma feature basta abrir uma pasta.
- Abas e filtros funcionam com o botão voltar, recarregar a página e links compartilhados.
- A regra "feature não importa feature" precisa ser mantida na revisão; hoje nada a verifica
  automaticamente.
