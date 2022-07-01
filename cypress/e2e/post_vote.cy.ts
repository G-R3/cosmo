// I think for this type of test, we should check if we get a 200 OK instead of comparing text values
// also i think only testing upvote and downvote is enough(?)

describe("Vote on a post", () => {
  // i tried setting this to 'before' but the 'should downvote' test would end up as a not authorized error.
  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();
  });

  it("Should upvote and then downvote", () => {
    let initialVotes;

    cy.get("[data-cy='post-votes']").then(($span) => {
      initialVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("getPost");
    cy.intercept("POST", "/api/trpc/vote.create?*").as("createVote");
    // upvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes + 1);
    });

    // downvote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes - 1);
    });

    cy.get("[data-cy='downvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
  });

  it("Should upvote", () => {
    let initialVotes;
    cy.get("[data-cy='post-votes']").then(($span) => {
      initialVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("getPost");
    cy.intercept("POST", "/api/trpc/vote.create?*").as("createVote");
    // upvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes + 1);
    });

    // undo upvote
    cy.get("[data-cy='upvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes);
    });
  });

  it("Should upvote", () => {
    let initialVotes;
    cy.get("[data-cy='post-votes']").then(($span) => {
      initialVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("getPost");
    cy.intercept("POST", "/api/trpc/vote.create?*").as("createVote");

    // downvote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes - 1);
    });

    // undo downvote
    cy.get("[data-cy='downvote-post']").click();
    cy.wait(["@createVote", "@getPost"]);
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(initialVotes);
    });
  });
});
