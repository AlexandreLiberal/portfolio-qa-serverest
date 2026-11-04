# Cenários de teste em BDD: ServeRest

Documentação dos 13 cenários automatizados com Cypress, escritos no formato BDD (Dado, Quando, Então).
Cada cenário tem o mesmo nome do teste correspondente em `cypress/e2e`.

## Resumo

| Área | Tipo | Arquivo | Cenários |
|---|---|---|---|
| Login | API | `cypress/e2e/api/login.cy.js` | 4 |
| Usuários | API | `cypress/e2e/api/usuarios.cy.js` | 7 |
| Login pela tela | Interface | `cypress/e2e/ui/login-ui.cy.js` | 2 |

---

## 1. Login (API)

```gherkin
Funcionalidade: Login de usuário via API
  Como usuário cadastrado na ServeRest
  Quero autenticar com e-mail e senha
  Para receber um token de acesso

  Contexto:
    Dado que existe um usuário cadastrado com e-mail e senha válidos

  Cenário: Login válido
    Quando envio POST /login com o e-mail e a senha corretos
    Então a API responde com status 200
    E a mensagem é "Login realizado com sucesso"
    E a resposta traz um token no formato "Bearer ..."

  Cenário: Senha errada
    Quando envio POST /login com o e-mail correto e uma senha incorreta
    Então a API responde com status 401
    E a mensagem é "Email e/ou senha inválidos"
    E a resposta não traz token

  Cenário: E-mail não cadastrado
    Quando envio POST /login com um e-mail que não existe na base
    Então a API responde com status 401
    E a mensagem é "Email e/ou senha inválidos"
    E a resposta não traz token

  Cenário: E-mail em branco
    Quando envio POST /login com o e-mail vazio
    Então a API responde com status 400
    E o erro informa "email não pode ficar em branco"
    E a resposta não traz token
```

**Observação de teste:** nos dois casos de status 401 a mensagem é a mesma, o que evita revelar se o e-mail existe na base.

---

## 2. Usuários (API)

```gherkin
Funcionalidade: Gestão de usuários via API
  Como administrador da loja
  Quero cadastrar e consultar usuários
  Para controlar quem acessa o sistema

  Cenário: Cadastro válido
    Quando envio POST /usuarios com nome, e-mail novo, senha e perfil administrador
    Então a API responde com status 201
    E a mensagem é "Cadastro realizado com sucesso"
    E a resposta traz o _id do usuário criado

  Cenário: E-mail repetido
    Dado que já existe um usuário cadastrado com determinado e-mail
    Quando envio POST /usuarios com esse mesmo e-mail
    Então a API responde com status 400
    E a mensagem é "Este email já está sendo usado"
    E nenhum usuário é criado (a resposta não traz _id)

  Cenário: Cadastro sem nome
    Quando envio POST /usuarios com o nome vazio
    Então a API responde com status 400
    E o erro informa "nome não pode ficar em branco"
    E nenhum usuário é criado

  Cenário: Cadastro sem senha
    Quando envio POST /usuarios com a senha vazia
    Então a API responde com status 400
    E o erro informa "password não pode ficar em branco"
    E nenhum usuário é criado

  Cenário: Listar todos
    Quando envio GET /usuarios
    Então a API responde com status 200
    E a resposta traz a lista de usuários
    E a quantidade informada é igual ao tamanho da lista
    E cada usuário tem os campos nome, email, password, administrador e _id

  Cenário: Buscar id com formato inválido
    Quando envio GET /usuarios com um id fora do padrão (ex.: "id_inexistente_123")
    Então a API responde com status 400
    E o erro informa "id deve ter exatamente 16 caracteres alfanuméricos"

  Cenário: Buscar id inexistente
    Quando envio GET /usuarios com um id válido que não existe na base
    Então a API responde com status 400
    E a mensagem é "Usuário não encontrado"
    E a resposta não traz dados de usuário
```

**Observação de teste:** buscar um id inexistente retorna 400. Em muitas APIs o esperado seria 404; aqui o teste valida o comportamento real da ServeRest.

---

## 3. Login pela tela (Interface)

```gherkin
Funcionalidade: Login pela interface web
  Como usuário cadastrado na ServeRest
  Quero entrar no sistema pela tela de login
  Para acessar a área de administração

  Contexto:
    Dado que existe um usuário cadastrado (criado pela API antes do teste)
    E que estou na tela de login em front.serverest.dev/login

  Cenário: Deve fazer login pela tela com sucesso
    Quando preencho o e-mail e a senha corretos
    E clico em "Entrar"
    Então sou levado para a página /admin/home
    E vejo o título "Bem Vindo"

  Cenário: Deve mostrar erro ao entrar com senha incorreta
    Quando preencho o e-mail correto e uma senha incorreta
    E clico em "Entrar"
    Então vejo a mensagem "Email e/ou senha inválidos"
    E continuo na tela de login
```

---

## Rastreabilidade

| Cenário | Teste automatizado |
|---|---|
| Login válido | `api/login.cy.js` > "Login válido" |
| Senha errada | `api/login.cy.js` > "Senha errada" |
| E-mail não cadastrado | `api/login.cy.js` > "E-mail não cadastrado" |
| E-mail em branco | `api/login.cy.js` > "E-mail em branco" |
| Cadastro válido | `api/usuarios.cy.js` > "Cadastro válido" |
| E-mail repetido | `api/usuarios.cy.js` > "E-mail repetido" |
| Cadastro sem nome | `api/usuarios.cy.js` > "Cadastro sem nome" |
| Cadastro sem senha | `api/usuarios.cy.js` > "Cadastro sem senha" |
| Listar todos | `api/usuarios.cy.js` > "Listar todos" |
| Buscar id com formato inválido | `api/usuarios.cy.js` > "Buscar id com formato inválido" |
| Buscar id inexistente | `api/usuarios.cy.js` > "Buscar id inexistente" |
| Login pela tela com sucesso | `ui/login-ui.cy.js` > "Deve fazer login pela tela com sucesso" |
| Erro com senha incorreta | `ui/login-ui.cy.js` > "Deve mostrar erro ao entrar com senha incorreta" |
