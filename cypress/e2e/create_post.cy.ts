import { generatePost } from "../support/generate";

describe("Post creation", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });

  it("Creates a post", () => {
    const { postTitle, postBody, postSlug } = generatePost();
    const searchField = "Skateboarding";
    cy.intercept("POST", "/api/trpc/post.create?*").as("createPost");

    cy.visit("/submit");

    cy.get("[data-cy='search-communities']").type(searchField);
    // cy.get("ul").eq(0).should("contain.text", searchField).click();
    cy.get("ul").find("li").contains(searchField, { matchCase: false }).click();

    cy.get("[data-cy='post-title']").type(postTitle);

    cy.get("[data-cy='post-body']").type(postBody);

    cy.get("[data-cy='submit']").click().should("be.disabled");
    cy.wait("@createPost").its("response.statusCode").should("eq", 200);

    // i'm sure there is a way to get the id from the response
    // but my head hurts right now
    // TODO: visit the new post page
    // cy.visit(`/c/${searchField}//${postSlug}`);

    // cy.get("h1").should("have.text", postTitle);
    // cy.get("[data-cy='post-community']").should("contain.text", searchField);
  });
});

export {};
