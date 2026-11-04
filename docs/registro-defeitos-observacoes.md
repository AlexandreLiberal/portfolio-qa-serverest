# Registro de defeitos e observações: ServeRest

Resultado das execuções de 03/11/2026 (Postman) e 04/11/2026 (Cypress).

## Resumo

- **Defeitos que reprovaram testes:** nenhum. Postman: 32 testes aprovados, 0 falhas. Cypress: 13 testes aprovados, 0 falhas.
- **Observações sobre o comportamento da API:** 3 (abaixo). Os testes validam o comportamento real da API; as observações indicam pontos que merecem discussão com quem especifica o produto.

## Observações

### OBS-01: Buscar usuário com id inexistente retorna 400

| Campo | Detalhe |
|---|---|
| Endpoint | `GET /usuarios/{_id}` |
| Passos | Enviar um id com formato válido (16 caracteres alfanuméricos) que não existe na base, por exemplo `abcdef1234567890` |
| Resultado obtido | Status `400` com a mensagem "Usuário não encontrado" |
| Resultado comumente esperado | Status `404` (recurso não encontrado) |
| Severidade sugerida | Baixa |
| Observação | Em REST, `404` costuma indicar recurso inexistente e `400` requisição malformada. Aqui o id é válido, só não existe. O teste automatizado valida `400`, que é o comportamento atual. Confirmar com a documentação da API se isso é intencional. |
| Cenário relacionado | "Buscar id inexistente" (`api/usuarios.cy.js`) |

### OBS-02: Listagem de usuários inclui o campo `password`

| Campo | Detalhe |
|---|---|
| Endpoint | `GET /usuarios` |
| Passos | Enviar a requisição de listagem sem autenticação |
| Resultado obtido | Cada usuário da lista vem com os campos `nome`, `email`, `password`, `administrador` e `_id` |
| Resultado comumente esperado | Respostas de listagem não devolvem senha |
| Severidade sugerida | Média, em um sistema real (aqui é uma API pública para estudo) |
| Observação | O teste valida a presença do campo `password`, então registra o comportamento atual. Verificar o formato do valor retornado e, em um produto real, abrir um defeito de exposição de dado sensível. |
| Cenário relacionado | "Listar todos" (`api/usuarios.cy.js`) |

### OBS-03: Mensagem única para e-mail inexistente e senha errada

| Campo | Detalhe |
|---|---|
| Endpoint | `POST /login` |
| Resultado obtido | As duas situações retornam `401` e "Email e/ou senha inválidos" |
| Avaliação | Comportamento adequado: não revela se o e-mail existe na base |
| Cenários relacionados | "Senha errada" e "E-mail não cadastrado" (`api/login.cy.js`) |

## Limitações conhecidas do ambiente de teste

- A ServeRest apaga os dados todos os dias. Por isso cada teste cria o próprio usuário, com e-mail único.
- Os testes dependem da API pública estar no ar. Uma indisponibilidade da ServeRest pode reprovar a suíte sem que haja defeito.
- A cobertura atual não inclui produtos, carrinhos nem rotas que exigem token. Fica como evolução do portfólio.
