# 🚀 Projeto de Avaliação Técnica - Teddy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)


## 📝 Descrição do Projeto

Este repositório contém o projeto de avaliação técnica desenvolvido por Kilmmer para a empresa **Teddy**. O objetivo foi demonstrar proficiência em desenvolvimento frontend com React e TypeScript, boas práticas de código, modularização de componentes, usabilidade e a capacidade de resolver desafios comuns em aplicações web.

O foco principal é a gestão de clientes, apresentando funcionalidades robustas de CRUD (Create, Read, Update, Delete) com uma interface de usuário otimizada.

### O que este projeto demonstra:

* **Habilidade Técnica:** Proficiência em React, TypeScript e Tailwind CSS para construir interfaces eficientes e escaláveis.
* **Boas Práticas:** Organização de código, reusabilidade de componentes e validação de formulários.
* **Usabilidade (UX):** Implementação de funcionalidades como paginação inteligente e máscaras de input para uma melhor experiência do usuário.
* **Resolução de Problemas:** Abordagem de desafios como formatação de dados em tempo real e persistência de valores numéricos brutos.
* **Visão de Engenharia:** Modularização de funcionalidades, preparação para integração com APIs REST e compreensão de arquiteturas escaláveis com uso de microsserviços e comunicação assíncrona.

## ✨ Funcionalidades Destaque

* **Gestão Completa de Clientes (CRUD):**
    * **Listagem:** Exibição paginada e organizada de registros de clientes.
    * **Criação:** Formulário com validação para adição de novos clientes.
    * **Edição:** Capacidade de atualizar detalhes de clientes existentes.
    * **Deleção:** Funcionalidade para remover registros de clientes.
* **Paginação Inteligente:** Componente de paginação customizado que exibe dinamicamente as páginas relevantes, utilizando reticências (`...`) para navegação em grandes conjuntos de dados, conforme a imagem fornecida.
* **Máscaras de Input de Valor:** Campos de entrada para Salário e Valor da Empresa com máscaras de moeda (`R$ X.XXX`), garantindo uma formatação amigável para o usuário, mas salvando os valores como números inteiros puros no backend.
* **Validação de Formulários:** Feedback visual claro para campos obrigatórios e formato inválido (ex: e-mail).
* **Design Moderno e Responsivo:** Estilização utilizando Tailwind CSS para uma interface limpa, intuitiva e que se adapta a diferentes dispositivos.

## 🚀 Tecnologias Utilizadas

### Frontend
* **React:** Biblioteca JavaScript para construção de interfaces de usuário dinâmicas.
* **TypeScript:** Adiciona tipagem estática ao JavaScript, aumentando a segurança e a manutenibilidade do código.
* **Tailwind CSS:** Framework CSS utilitário para um desenvolvimento rápido e flexível de designs.

### Backend (Contexto de Integração)
Este frontend é projetado para consumir uma API RESTful. Em um cenário de produção ou de complexidade semelhante a que Kilmmer está acostumado a trabalhar, essa API de backend seria construída com tecnologias robustas, incluindo:
* **Node.js (com NestJS/ExpressJS):** Para a lógica de negócios e endpoints da API.
* **TypeScript:** Para um backend fortemente tipado e de alta qualidade.
* **PostgreSQL:** Como banco de dados relacional principal, conhecido por sua robustez, extensibilidade e conformidade com padrões SQL.
* **RabbitMQ:** Utilizado para comunicação assíncrona entre serviços, mensageria e processamento de tarefas em background, garantindo escalabilidade e resiliência.
* **Redis:** Empregado para caching, gerenciamento de sessões ou como um message broker leve (pub/sub), otimizando a performance e a resposta da API.

### Ferramentas de Desenvolvimento
* **Node.js:** Ambiente de execução JavaScript.
* **Yarn / NPM:** Gerenciadores de pacotes para o projeto.
* **Git / GitHub:** Para controle de versão e colaboração.
* **Docker:** (Opcional) Para conteinerização e padronização do ambiente de desenvolvimento.

## ⚙️ Instalação e Configuração

Para configurar e executar o projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/en/download/) (versão LTS recomendada)
* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (ou NPM, se preferir)
* [Git](https://git-scm.com/downloads)
* [Docker](https://www.docker.com/products/docker-desktop) (opcional, para conteinerização do ambiente)

### 1. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/projeto-avaliacao-teddy.git](https://github.com/seu-usuario/projeto-avaliacao-teddy.git)
cd projeto-avaliacao-teddy
````

### 2\. Instalar Dependências

Utilizando Yarn:

```bash
yarn install
```

Ou utilizando NPM:

```bash
npm install
```

### 3\. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example` (se existir) ou crie-o manualmente com a seguinte variável:

```
# Exemplo de .env
# Endereço da API de backend que este frontend consumirá
REACT_APP_API_URL=http://localhost:3000/api
```

**Observação:** Ajuste `REACT_APP_API_URL` para o endereço da API que você utilizará para o teste, caso seja fornecida uma. Caso contrário, utilize um placeholder ou um mock de API.

### 4\. Executar o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
yarn start
```

Ou utilizando NPM:

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:3000` (ou outra porta disponível, conforme indicado no terminal).

### 5\. Executar com Docker (Opcional)

Se você preferir executar o ambiente em um container Docker:

```bash
# Construir a imagem Docker
docker build -t projeto-avaliacao-teddy .

# Rodar o container
docker run -p 3000:3000 projeto-avaliacao-teddy
```

O frontend estará acessível em `http://localhost:3000`.

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para promover a modularidade e a manutenibilidade do código, essencial para um projeto de qualquer escala:

```
.
├── public/                # Arquivos estáticos
├── src/
│   ├── assets/            # Imagens, ícones, etc.
│   ├── components/        # Componentes reutilizáveis (e.g., Button, Input, Modal, Pagination, ClientForm)
│   ├── hooks/             # Custom Hooks (se houver, para lógica reutilizável)
│   ├── services/          # Funções para interação com a API (e.g., api.ts)
│   ├── pages/             # Componentes de páginas/rotas (e.g., ClientsPage para a listagem)
│   ├── styles/            # Arquivos de estilo globais (e.g., tailwind.css)
│   ├── types/             # Definições de tipos TypeScript (interfaces)
│   ├── App.tsx            # Componente principal e roteamento
│   └── index.tsx          # Ponto de entrada da aplicação
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Arquivos e pastas a serem ignorados pelo Git
├── package.json           # Dependências e scripts do projeto
├── tailwind.config.js     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
└── README.md              # Este arquivo
```

## 📊 Estimativas para Desenvolvimento de Painel Administrativo

Considerando um painel administrativo com funcionalidades de gestão de usuários, relatórios básicos, auditoria de logs e configuração de sistema, estimamos o seguinte para uma primeira fase de desenvolvimento:

1.  **Tempo Estimado:** 40 horas
2.  **Número de Desenvolvedores:** 4
3.  **Senioridade da Equipe:**
      * 1 Tech Lead
      * 1 Desenvolvedor Sênior
      * 2 Desenvolvedores Plenos

Essa composição de equipe visa otimizar a produtividade e a qualidade, com o Tech Lead fornecendo a direção arquitetural e técnica, o desenvolvedor sênior atuando como um pilar de execução e mentoria, e os desenvolvedores plenos contribuindo com o desenvolvimento sob supervisão e ganhando experiência.

## 🤝 Contribuição e Próximos Passos (para avaliação)

Este projeto é uma base sólida e demonstra a capacidade de construir aplicações frontend robustas. Para a evolução e aprimoramento contínuo do sistema, os próximos passos e áreas de melhoria a serem exploradas incluem:

  * **Responsividade Aprimorada no Frontend:** Refinamento da interface para garantir uma experiência de usuário impecável em todos os dispositivos e tamanhos de tela, utilizando abordagens como Mobile-First, Flexbox/Grid e media queries avançadas.
  * **Validações Abrangentes no Backend:** Implementação de validações de dados robustas e abrangentes no lado do servidor para garantir a integridade, segurança e consistência dos dados, prevenindo entradas inválidas ou maliciosas antes que atinjam o banco de dados.
  * **Cobertura de Testes Elevada:** Expansão significativa da cobertura de testes, incluindo:
      * **Testes Unitários:** Para componentes individuais e funções, garantindo que cada parte do código funcione conforme o esperado.
      * **Testes de Integração:** Para verificar a interação entre diferentes módulos e serviços (incluindo as chamadas de API), assegurando que o sistema funcione como um todo.
      * **Testes End-to-End (E2E):** (Opcional, mas valioso) Para simular cenários de usuário real e validar fluxos de trabalho completos na aplicação.
  * **Gerenciamento de Estado Global:** Utilização de Context API, Redux ou Zustand para um gerenciamento de estado mais complexo e escalável em aplicações maiores.
  * **Otimizações de Performance:** Implementação de técnicas como lazy loading de componentes e rotas, memoização (com `React.memo`, `useMemo`, `useCallback`) e otimização de renderização para garantir a máxima fluidez.
  * **Internacionalização (i18n):** Adição de suporte a múltiplos idiomas, permitindo que a aplicação seja utilizada por um público global.
  * **Acessibilidade (a11y):** Melhorias contínuas para garantir que a aplicação seja acessível a usuários com diferentes necessidades, seguindo as diretrizes WCAG.
  * **Documentação da API:** Se o backend também fizer parte do escopo de desenvolvimento, a criação e manutenção de uma documentação detalhada da API (ex: via OpenAPI/Swagger) é fundamental para facilitar a integração e o entendimento por outros desenvolvedores.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

-----

**Desenvolvido por Kilmmer**

  * **Perfil:** Desenvolvedor de Software com perfil visionário e desafiador. Possui experiência em arquiteturas de backend escaláveis, incluindo microsserviços e sistemas distribuídos.
  * **Experiência com Backend:** Sólida atuação com Node.js (NestJS/ExpressJS), TypeScript, PostgreSQL, RabbitMQ e Redis para construção de APIs REST e sistemas de mensageria/cache. Experiência também com desenvolvimento mobile em Flutter.
  * **Interesses:** Aviação (comercial, civil, militar), carros, motos, motores, e estratégias de negócios e empresas.
  * **GitHub:** [Seu\_Usuario\_GitHub](https://www.google.com/search?q=https://github.com/Seu_Usuario_GitHub)

*Este README foi elaborado para o teste de Tech Lead da empresa Teddy, destacando as competências relevantes para a posição, incluindo a visão arquitetural de backend, planejamento de equipe e foco em melhorias contínuas.*
