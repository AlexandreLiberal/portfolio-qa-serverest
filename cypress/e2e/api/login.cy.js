describe("API ServeRest - Login", () => {
  let usuarioBase;

  before(() => {
    cy.criarUsuario().then(({ usuario }) => {
      usuarioBase = usuario;
    });
  });

  it("Login válido", () => {
    cy.request("POST", "/login", {
      email: usuarioBase.email,
      password: usuarioBase.password,
    }).then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.body.message).to.eq("Login realizado com sucesso");
      expect(resposta.body.authorization).to.be.a("string").and.match(/^Bearer /);
    });
  });

  it("Senha errada", () => {
    cy.request({
      method: "POST",
      url: "/login",
      body: { email: usuarioBase.email, password: "senha_errada_999" },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(401);
      expect(resposta.body.message).to.eq("Email e/ou senha inválidos");
      expect(resposta.body).to.not.have.property("authorization");
    });
  });

  it("E-mail não cadastrado", () => {
    cy.request({
      method: "POST",
      url: "/login",
      body: { email: "usuario.inexistente.qa@qa.com.br", password: "teste123" },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(401);
      expect(resposta.body.message).to.eq("Email e/ou senha inválidos");
      expect(resposta.body).to.not.have.property("authorization");
    });
  });

  it("E-mail em branco", () => {
    cy.request({
      method: "POST",
      url: "/login",
      body: { email: "", password: "teste123" },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.email).to.eq("email não pode ficar em branco");
      expect(resposta.body).to.not.have.property("authorization");
    });
  });
});