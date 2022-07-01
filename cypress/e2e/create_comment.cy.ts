import { generateCommentBody } from "../support/generate";

describe("Create comment", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();
  });

  it("not allow on empty body", () => {
    cy.intercept("POST", "/api/trpc/comment.create?*").as("createComment");
    cy.get("[data-cy='create-comment']").contains("Post").click();

    cy.wait("@createComment").its("response.statusCode").should("eq", 400);
  });

  it("add a new comment to post", () => {
    cy.intercept("POST", "/api/trpc/comment.create?*").as("createComment");
    cy.get("textarea").type(generateCommentBody());

    cy.get("[data-cy='create-comment']").contains("Post").click();
    cy.wait("@createComment").its("response.statusCode").should("eq", 200);
  });
});

export {};
