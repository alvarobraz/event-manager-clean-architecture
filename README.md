<p align="center">
  <a href="https://github.com/alvarobraz/event-manager-clean-architecture" target="blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="120" alt="Node.js Logo" />
  </a>
</p>

<h1 align="center">Event Manager - Clean Architecture 🚀</h1>

<p align="center">
  Aplicação backend para gerenciamento de eventos e inscrições, desenvolvida com Node.js, TypeScript e PostgreSQL seguindo os princípios de Clean Architecture.
</p>

<p align="center">
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/alvarobraz/event-manager-clean-architecture"/>

  <a href="https://nodejs.org/">
    <img alt="Node.js Version" src="https://img.shields.io/badge/node.js-20.19.3+-green">
  </a>

  <a href="https://www.linkedin.com/in/alvarobraz/">
    <img alt="Made by alvarobraz" src="https://img.shields.io/badge/made%20by-alvarobraz-%237519C1">
  </a>

  <a href="https://github.com/alvarobraz/event-manager-clean-architecture">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/alvarobraz/event-manager-clean-architecture">
  </a>

  <img alt="License" src="https://img.shields.io/github/license/alvarobraz/event-manager-clean-architecture">
</p>

---

<p align="center">
  <a href="#dart-sobre">Sobre</a> &#xa0; | &#xa0; 
  <a href="#rocket-tecnologias">Tecnologias</a> &#xa0; | &#xa0;
  <a href="#test_tube-testes">Testes</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requerimentos">Requerimentos</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-começando">Começando</a>
</p>

<br>

## :dart: Sobre

O **Event Manager** é um ecossistema backend desenhado para alta escalabilidade e manutenibilidade. O projeto permite a criação de eventos com suporte a anexos (banners via S3), gestão de participantes e um sistema de inscrições (Registrations) com suporte total a **paginação** de alta performance.

A arquitetura separa claramente as regras de negócio (Use Cases) dos detalhes de implementação (Express, Prisma, Cloud Flare EC2), garantindo que o núcleo da aplicação seja independente de ferramentas externas e totalmente testável.

## :rocket: Tecnologias

O projeto utiliza as tecnologias mais modernas do ecossistema backend:

### Core & Application

- **Node.js 20+** com **Express** (HTTP Server).
- **TypeScript** - Tipagem estática para segurança no desenvolvimento.
- **Zod** - Validação rigorosa de esquemas e contratos de dados.
- **Clean Architecture** - Separação em camadas: Domain, Application e Infra.
- **SOLID** - Princípios aplicados para garantir desacoplamento.

### Persistência & Infra

- **Prisma ORM** - Modelagem de dados e Type-safe queries.
- **PostgreSQL** - Banco de dados relacional.
- **AWS SDK (@aws-sdk/client-s3)** - Gerenciamento de uploads em nuvem.
- **Multer** - Manipulação de multipart/form-data.

### Qualidade & Ferramentas

- **Vitest** - Runner de testes ultra rápido com suporte a SWC.
- **Supertest** - Testes de integração (E2E) ponta a ponta.
- **Husky & Commitlint** - Padronização de mensagens de commit (Conventional Commits).
- **ESLint & Prettier** - Padronização de estilo de código.

## :test_tube: Testes

O projeto prioriza a testabilidade com diferentes níveis de isolamento:

```bash
# Testes Unitários (Foco nos Use Cases e Domínio)
$ npm run test

# Modo Watch para desenvolvimento ágil
$ npm run test:watch

# Testes E2E (Integração com Banco de Dados e HTTP)
$ npm run test:e2e

# Modo Watch para desenvolvimento ágil
$ npm run test:e2e:watch

```

:white_check_mark: Requerimentos
Node.js 20.19.3+

PostgreSQL

:checkered_flag: Começando

```bash
## Clone o projeto

$ git clone [https://github.com/alvarobraz/event-manager-clean-architecture](https://github.com/alvarobraz/event-manager-clean-architecture)

## Acesse a pasta

$ cd event-manager-clean-architecture

## Instale as dependências

$ npm install

## Configure seu .env (DATABASE_URL, CLOUDFLARE_KEYS)

$ cp .env.example .env

## Sincronize o banco de dados e rode as migrations

$ npx prisma migrate dev

## Popule o banco com o seed global (15 eventos e 50 participantes)

$ npx prisma db seed

## Inicie o servidor de desenvolvimento

$ npm run start:dev

## O servidor estará disponível em http://localhost:3333.
```

---

### `.env.example`

```markdown
# Database Connection (PostgreSQL/MySQL)

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# Cloud Flare Credentials (S3 Storage)

CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_key
CLOUDFLARE_BUCKET_NAME=your_bucket_name
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
```
