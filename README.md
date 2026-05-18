# 🍓 Gintama Genius

> Um jogo de memória e reflexos inspirado no universo de Gintama.

[![CI/CD Pipeline](https://github.com/juninmd/Gintama-Genius/actions/workflows/ci.yml/badge.svg)](https://github.com/juninmd/Gintama-Genius/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/juninmd/Gintama-Genius/branch/main/graph/badge.svg)](https://codecov.io/gh/juninmd/Gintama-Genius)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-GHCR-blue?style=for-the-badge&logo=docker)](https://github.com/juninmd/Gintama-Genius/pkgs/container/gintama-genius)

## 📝 Descrição

**Gintama Genius** é um web game que desafia sua memória com personagens e referências da série Gintama. Desenvolvedores com foco em animações fluidas e uma experiência de usuário divertida (e um pouco caótica, como a própria série).

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Testes**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **CI/CD**: GitHub Actions + Docker + GHCR
- **Deployment**: Nginx + Docker + Kubernetes

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/juninmd/Gintama-Genius.git

# Entre na pasta da web
cd gintama-genius-web

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes com cobertura
npx vitest run --coverage

# Modo watch
pnpm test -- --watch
```

## 📦 Build

```bash
pnpm build
```

O build gera arquivos otimizados em `dist/` com:
- Minificação via Terser
- Source maps para debug
- Code splitting (vendor, motion, confetti chunks)
- Cache busting com hashes nos arquivos

## 🔍 Qualidade

- **Linting**: ESLint com TypeScript
- **Type Checking**: TypeScript strict mode
- **Test Coverage**: Mínimo 80% (statements, functions, lines)
- **Segurança**: Trivy scan em imagens Docker
- **Dependências**: Auditoria com `pnpm audit`

## 🐳 Docker

```bash
# Construir imagem
docker build -t gintama-genius .

# Executar container
docker run -p 80:80 gintama-genius
```

## 📦 Deployment

O deployment é automatizado via GitHub Actions:

| Branch | Ambiente | Ação |
|--------|----------|------|
| `develop` | Staging | Deploy automático após build |
| `main` | Production | Build, push Docker image, deploy |

### Pipeline CI/CD

1. **Lint**: ESLint, Prettier, TypeScript check, dependências
2. **Test**: Vitest com cobertura, upload para Codecov
3. **Build**: Frontend (Vite) + Backend (VB.NET)
4. **Docker**: Build e push para GHCR (apenas main)
5. **Deploy**: Staging (develop) → Production (main)

### Rollback

Em caso de falha no deploy, o pipeline executa rollback automático via Kubernetes rollout undo.

## 📁 Estrutura do Projeto

```
gintama-genius-web/
├── src/
│   ├── components/    # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utilitários
│   ├── styles/        # Arquivos CSS
│   └── assets/        # Recursos estáticos
├── public/            # Arquivos públicos
└── ...config files
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `CODECOV_TOKEN` | Token para upload de cobertura | Sim (CI) |
| `SLACK_WEBHOOK_URL` | Webhook para notificações de deploy | Não |
| `GITHUB_TOKEN` | Token do GitHub Actions | Automático |

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines de contribuição.

## 📄 Licença

MIT

---

> "ZURA JA NAI, KATSURA DA!"
