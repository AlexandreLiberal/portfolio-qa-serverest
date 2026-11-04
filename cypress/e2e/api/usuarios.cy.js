describe("API ServeRest - Usuários", () => {
  let usuarioBase;

  before(() => {
    cy.criarUsuario().then(({ usuario }) => {
      usuarioBase = usuario;
    });
  });

  it("Cadastro válido", () => {
    cy.criarUsuario().then(({ resposta }) => {
      expect(resposta.status).to.eq(201);
      expect(resposta.body.message).to.eq("Cadastro realizado com sucesso");
      expect(resposta.body).to.have.property("_id");
    });
  });

  it("E-mail repetido", () => {
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: usuarioBase,
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.message).to.eq("Este email já está sendo usado");
      expect(resposta.body).to.not.have.property("_id");
    });
  });

  it("Cadastro sem nome", () => {
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: {
        nome: "",
        email: `sem.nome.${Date.now()}@qa.com.br`,
        password: "teste123",
        administrador: "true",
      },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.nome).to.eq("nome não pode ficar em branco");
      expect(resposta.body).to.not.have.property("_id");
    });
  });

  it("Cadastro sem senha", () => {
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: {
        nome: "Alexandre QA",
        email: `sem.senha.${Date.now()}@qa.com.br`,
        password: "",
        administrador: "true",
      },
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.password).to.eq("password não pode ficar em branco");
      expect(resposta.body).to.not.have.property("_id");
    });
  });

  it("Listar todos", () => {
    cy.request("GET", "/usuarios").then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.body.usuarios).to.be.an("array");
      expect(resposta.body.quantidade).to.eq(resposta.body.usuarios.length);
      expect(resposta.body.usuarios[0]).to.have.all.keys(
        "nome",
        "email",
        "password",
        "administrador",
        "_id"
      );
    });
  });

  it("Buscar id com formato inválido", () => {
    cy.request({
      method: "GET",
      url: "/usuarios/id_inexistente_123",
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.id).to.eq(
        "id deve ter exatamente 16 caracteres alfanuméricos"
      );
    });
  });

  it("Buscar id inexistente", () => {
    cy.request({
      method: "GET",
      url: "/usuarios/abcdef1234567890",
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(400);
      expect(resposta.body.message).to.eq("Usuário não encontrado");
      expect(resposta.body).to.not.have.any.keys("nome", "email", "password", "_id");
    });
  });
});