describe("Vote on a post", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });

  it("should like and unlike post", () => {
    cy.intercept("GET", "/api/trpc/post.get-by-id?*").as("getPost");
    cy.intercept("POST", "/api/trpc/post.like?*").as("likePost");
    cy.intercept("POST", "/api/trpc/post.unlike?*").as("unlikePost");

    cy.get("[data-cy='post-link']").eq(0).click();
    cy.wait("@getPost").its("response.statusCode").should("eq", 200);

    // like
    cy.get("[data-cy='like-post']").click();
    cy.wait("@likePost").its("response.statusCode").should("eq", 200);

    // unlike
    cy.get("[data-cy='like-post']").click();
    cy.wait("@unlikePost").its("response.statusCode").should("eq", 200);
  });
});

export {};
