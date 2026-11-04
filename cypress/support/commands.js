// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// Cria um usuário com e-mail novo a cada chamada (a ServeRest não aceita e-mail repetido)
Cypress.Commands.add("criarUsuario", (sobrescrever = {}) => {
  const usuario = {
    nome: "Alexandre QA",
    email: `alexandre.${Date.now()}.${Cypress._.random(1000, 9999)}@qa.com.br`,
    password: "teste123",
    administrador: "true",
    ...sobrescrever,
  };

  return cy.request("POST", "/usuarios", usuario).then((resposta) => ({
    usuario,
    resposta,
  }));
});