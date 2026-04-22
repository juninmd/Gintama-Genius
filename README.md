# 🍓 Gintama Genius

> Um jogo de memória e reflexos inspirado no universo de Gintama.

[![Deployment Status](https://img.shields.io/badge/ArgoCD-Synced-success?style=for-the-badge&logo=argocd)](https://argocd.antonio-code.duckdns.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 📝 Descrição

**Gintama Genius** é um web game que desafia sua memória com personagens e referências da série Gintama. Desenvolvedores com foco em animações fluidas e uma experiência de usuário divertida (e um pouco caótica, como a própria série).

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Deployment**: Nginx + Docker

## 🚀 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/juninmd/Gintama-Genius.git
   ```
2. Entre na pasta da web:
   ```bash
   cd gintama-genius-web
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o jogo:
   ```bash
   npm run dev
   ```

## 📦 Deployment

Este projeto é servido via **Nginx** no cluster **K3s**.

- **URL de Produção**: [https://gintama.antonio-code.duckdns.org](https://gintama.antonio-code.duckdns.org)