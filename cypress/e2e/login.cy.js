describe("API ServeRest - Login", () => {
  const usuario = {
    nome: "Usuario Teste",
    email: `qa_${Date.now()}@teste.com`,
    password: "senha123",
    administrador: "true",
  };

  before(() => {
    // A ServeRest apaga os dados todo dia, por isso criamos o usuário no teste
    cy.request("POST", "/usuarios", usuario).then((resposta) => {
      expect(resposta.status).to.eq(201);
    });
  });

  it("Deve fazer login com sucesso", () => {
    cy.request("POST", "/login", {
      email: usuario.email,
      password: usuario.password,
    }).then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.body.message).to.eq("Login realizado com sucesso");
      expect(resposta.body).to.have.property("authorization");
    });
  });

  it("Não deve fazer login com senha incorreta", () => {
    cy.request({
      method: "POST",
      url: "/login",
      body: { email: usuario.email, password: "senhaErrada" },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(401);
      expect(resposta.body.message).to.eq("Email e/ou senha inválidos");
    });
  });
});