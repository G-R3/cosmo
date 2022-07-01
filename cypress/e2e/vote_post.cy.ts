describe("Post voting", () => {
  it("Fail to vote", () => {
    cy.clearCookies();
    cy.visit("/");

    cy.get("[data-cy='post-link']").eq(0).click();

    cy.get("[data-cy='upvote-post']").click();

    cy.get("[data-cy='alert-error']").should("be.visible");

    cy.get("[data-cy='downvote-post']").click();

    cy.get("[data-cy='alert-error']").should("be.visible");
  });

  it("Should upvote post", () => {
    let postVotes;
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();

    cy.get("[data-cy='post-votes']").then(($span) => {
      postVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("postVote");
    cy.get("[data-cy='upvote-post']").click();

    cy.wait("@postVote");
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(postVotes + 1);
    });
  });

  it("Should undo upvote", () => {
    let postVotes;
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();

    cy.get("[data-cy='post-votes']").then(($span) => {
      postVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("postVote");
    cy.get("[data-cy='upvote-post']").click();

    cy.wait("@postVote");
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(postVotes - 1);
    });
  });

  it("Should downvote post", () => {
    let postVotes;
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();

    cy.get("[data-cy='post-votes']").then(($span) => {
      postVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("postVote");
    cy.get("[data-cy='downvote-post']").click();

    cy.wait("@postVote");
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(postVotes - 1);
    });
  });

  it("Should undo downvote", () => {
    let postVotes;
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.get("[data-cy='post-link']").eq(0).click();

    cy.get("[data-cy='post-votes']").then(($span) => {
      postVotes = parseInt($span.text());
    });

    cy.intercept("GET", "/api/trpc/post.get?*").as("postVote");
    cy.get("[data-cy='downvote-post']").click();

    cy.wait("@postVote");
    cy.get("[data-cy='post-votes']").then(($span) => {
      const newVotes = parseInt($span.text());

      expect(newVotes).to.eq(postVotes + 1);
    });
  });
});
