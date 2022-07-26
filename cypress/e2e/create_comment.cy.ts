import { generateCommentBody } from "../support/generate";

describe("Create comment", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();
  });

  it("not allow on empty body", () => {
    cy.intercept("POST", "/api/trpc/comment.create?*").as("createComment");
    cy.get("[data-cy='create-comment']").contains("Post").should("be.disabled");

    cy.get("textarea").type("         ");
    cy.get("[data-cy='create-comment']").contains("Post").click();

    cy.get("[data-cy='form-error']").should("be.visible");

    // cy.wait("@createComment").its("response.statusCode").should("eq", 400);
  });

  it("add a new comment to post", () => {
    cy.intercept("POST", "/api/trpc/comment.create?*").as("createComment");
    cy.get("textarea").type(generateCommentBody());

    cy.get("[data-cy='create-comment']").contains("Post").click();
    cy.wait("@createComment").its("response.statusCode").should("eq", 200);
  });

  it("edits it and deletes comment", () => {
    const newCommentBody = generateCommentBody();
    cy.intercept("POST", "/api/trpc/comment.edit?*").as("editComment");
    cy.intercept("POST", "/api/trpc/comment.delete?*").as("deleteComment");

    cy.get("[data-cy='comment-edit']").eq(0).click();
    cy.get("[data-cy='save-comment-edit']").should("be.disabled");

    cy.get("[data-cy='comment-edit-textarea']")
      .should("be.visible")
      .clear()
      .type(newCommentBody);

    cy.get("[data-cy='save-comment-edit']").click();
    cy.wait("@editComment").its("response.statusCode").should("eq", 200);

    cy.get("[data-cy='comment-delete']").eq(0).click();
    cy.get("[data-cy='delete-modal']").should("be.visible");
    cy.get("[data-cy='confirm-delete-comment']")
      .click()
      .should("contain.text", "Deleting...");

    cy.wait("@deleteComment").its("response.statusCode").should("eq", 200);
    cy.get("[data-cy='delete-modal']").should("not.exist");
  });
});

export {};
