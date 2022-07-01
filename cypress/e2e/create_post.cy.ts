import { generatePost } from "../support/generate";

describe("Post creation", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });

  it("Creates a post", () => {
    const { postTitle, postBody, postSlug } = generatePost();
    cy.visit("/submit");

    cy.get("input").type(postTitle);

    cy.get("textarea").type(postBody);

    cy.get("[data-cy='submit']").click().should("be.disabled");

    cy.visit(`/post/${postSlug}`);
    cy.get("h1").should("have.text", postTitle);
  });
});
