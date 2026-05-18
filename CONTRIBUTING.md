# Contribuindo para Gintama Genius

Obrigado pelo interesse em contribuir! 🎉

## Código de Conduta

Seja respeitoso e construtivo. Lembre-se: "Zura ja nai, Katsura da!"

## Pipeline CI/CD

### Quality Gates (Obrigatórios)

1. **Linting**: `pnpm lint` deve passar sem erros
2. **TypeScript**: `npx tsc --noEmit` deve passar
3. **Testes**: `pnpm test` deve passar com cobertura >= 80%
4. **Build**: `pnpm build` deve compilar com sucesso

### Fluxo de Trabalho

```
feature/foo → develop (PR) → staging (deploy) → main (PR) → production
```

1. Crie uma branch a partir de `develop`
2. Implemente a funcionalidade com testes
3. Abra um Pull Request para `develop`
4. Após aprovação, faça merge para `develop`
5. O CI/CD deploya automaticamente para staging
6. Abra PR de `develop` para `main` para produção

## Requisitos de Código

### Testes

- Mínimo 80% de cobertura (linhas, branches, funções)
- Testes unitários para toda lógica de negócio
- Testes de componentes para UI crítica
- Testes de hooks para estado e efeitos

### Estilo

- TypeScript estrito (strict mode)
- 2 espaços para indentação
- 120 caracteres por linha
- Nomes descritivos em português/inglês
- Sem console.log em produção

### Commits

Siga [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adicionar modo hardcore
fix: corrigir contagem de streak
chore: atualizar dependências
test: adicionar testes para useGameScore
docs: atualizar README com badges
```

## Review

Todos os PRs passam por:
- Revisão de código automatizada (ESLint, TypeScript)
- Testes em CI
- Revisão manual de ao menos 1 mantenedor
