// I think for this type of test, we should check if we get a 200 OK instead of comparing text values
// also i think only testing upvote and downvote is enough(?)

describe("Vote on a post", () => {
  // i tried setting this to 'before' but the 'should downvote' test would end up as a not authorized error.
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });

  it("Should upvote and then downvote", () => {
    cy.intercept("GET", "/api/trpc/post.get?*").as("getPost");
    cy.intercept("POST", "/api/trpc/post.vote?*").as("createVote");

    cy.get("[data-cy='post-link']").eq(0).click();
    cy.wait("@getPost").its("response.statusCode").should("eq", 200);

    // upvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);

    // undo upvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);

    // downvote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);

    // undow downvote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);

    // upvote and then downvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);
    cy.get("[data-cy='downvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);

    // reset vote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait("@createVote").its("response.statusCode").should("eq", 200);
  });
});

export {};
