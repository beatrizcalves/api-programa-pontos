# API Programa de Pontos

Esta é a API para um sistema de programa de pontos, que permite gerenciar clientes, transações, recompensas e histórico de pontos.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Swagger

## Instalação

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd api-programa-pontos
    ```
3. Instale as dependências:
    ```sh
    npm install
    ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
    ```env
    MONGO_URI=<SUA_URI_DO_MONGODB>
    PORT=3000
    ```

## Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento:
```sh
npm run dev
```
## Documentação da API
A documentação da API é gerada automaticamente pelo Swagger. Após iniciar a aplicação, acesse:
```sh
http://localhost:3000/api-docs
```

## Estrutura do Projeto

- `src/`
  - `app.js`: Ponto de entrada da aplicação.
  - `config/`: Configurações da aplicação (banco de dados, Swagger).
  - `entities/`: Modelos do Mongoose.
  - `middlewares/`: Middlewares personalizados.
  - `routes/`: Definições de rotas da API.
  - `services/`: Lógica de negócios e comunicação com o banco de dados.
  - `validations/`: Validações de dados de entrada.
