Clarke Dashboard
==========

## Tecnologias
![Typescript Badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Graphql](https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Apollo](https://img.shields.io/badge/Apollo%20GraphQL-311C87?&style=for-the-badge&logo=Apollo%20GraphQL&logoColor=white)
![Shadcn](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Vite](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Configuração do Projeto
-----------------------

1.  **Clone o Repositório:*

    ```bash
    git clone https://github.com/usuario/clarke_challenge_frontend.git
    cd clarke_challenge_frontend
    ```

2.  **Instale as Dependências:**

    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto e adicione a URL do seu backend GraphQL:

    ```bash
    GRAPHQL_URL=http://localhost:3000/graphql
    ```

6.  **Execute o Projeto:**

    ```bash
    npm run dev
    ```

    Isso iniciará o servidor de desenvolvimento. Abra seu navegador e acesse http://localhost:3000. Verifique a disponibilidade da porta.

Estrutura do Projeto
--------------------

-   **`src/components`**: Componentes reutilizáveis, incluindo inputs e botões estilizados com Shadcn.
-   **`src/services/queries.ts`**: Definições de consultas e mutações GraphQL.
-   **`src/utils/validations.ts`**: Funções de validação para o formulário de registro.

Validações no Registro
----------------------

Na página de registro, são realizadas validações para garantir que os dados inseridos sejam válidos:

-   **Nome**: Deve ter pelo menos 3 caracteres.
-   **Email**: Deve ser um email válido.
-   **Senha**: Deve ter pelo menos 6 caracteres.
-   **CPF**: Deve ter exatamente 11 dígitos. (Para usuários)

As validações são aplicadas no formulário antes que os dados sejam enviados ao servidor. Erros de validação são exibidos abaixo dos campos de entrada correspondentes para orientar o usuário na correção dos dados.

Exemplo de Uso
--------------

### Login

O usuário pode realizar o login com o email e senha. Após a autenticação, o token de autenticação, id, email, nome e id da conta são armazenados no `localStorage` e o usuário é redirecionado para o dashboard.

### Registro

O usuário pode criar uma nova conta fornecendo nome, email, senha e CPF. Assegure-se de que todos os campos estejam corretamente preenchidos para uma criação bem-sucedida da conta.

Deploy
------------

Acesse o projeto diretamente pelo [link de deploy](https://woovibank.netlify.app/). Por se tratar de um deploy free a primeira requisição após o sistema estar inativo demora em torno de 50s para acontecer.
