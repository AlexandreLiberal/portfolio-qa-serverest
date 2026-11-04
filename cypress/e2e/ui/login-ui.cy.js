describe("Interface ServeRest - Login", () => {
  let usuario;

  before(() => {
    // Cria o usuário pela API (rápido) para usar no login pela tela
    cy.criarUsuario().then(({ usuario: criado }) => {
      usuario = criado;
    });
  });

  beforeEach(() => {
    cy.visit("https://front.serverest.dev/login");
  });

  it("Deve fazer login pela tela com sucesso", () => {
    cy.get('[data-testid="email"]').type(usuario.email, { delay: 80 });
    cy.get('[data-testid="senha"]').type(usuario.password, { delay: 80 });
    cy.get('[data-testid="entrar"]').click();

    cy.url().should("include", "/admin/home");
    cy.contains("Bem Vindo").should("be.visible");
  });

  it("Deve mostrar erro ao entrar com senha incorreta", () => {
    cy.get('[data-testid="email"]').type(usuario.email, { delay: 80 });
    cy.get('[data-testid="senha"]').type("senha_errada_999", { delay: 80 });
    cy.get('[data-testid="entrar"]').click();

    cy.contains("Email e/ou senha inválidos").should("be.visible");
  });
});