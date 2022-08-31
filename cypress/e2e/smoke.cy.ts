import {
  generateCommentBody,
  generateCommunity,
  generatePost,
} from "../support/generate";

describe("smoke test", () => {
  it("should handle normal app flow", () => {
    const { communityName, communityDescription } = generateCommunity();
    // loging user
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    // create community
    cy.get("[data-cy='create-community-modal']").click({
      waitForAnimations: false,
    });
    cy.get("[data-cy=community-name]").type(communityName);
    cy.get("[data-cy=confirm-create]").click();
    cy.visit(`/community/${communityName}`);
    cy.url().should("include", communityName);

    cy.get("[data-cy='create-community-modal']").click();
    cy.get("[data-cy=community-name]").type(communityName);
    cy.get("[data-cy=confirm-create]").click();
    cy.get("[data-cy='alert']").should("be.visible");

    // create post
    const { postTitle, postBody } = generatePost();
    cy.visit("/submit");
    cy.get("[data-cy='search-communities']").type(communityName);
    cy.get("ul")
      .find("li")
      .contains(communityName, { matchCase: false })
      .click();

    cy.get("[data-cy='post-title']").type(postTitle);
    cy.get("[data-cy='post-body']").type(postBody);
    cy.get("[data-cy='submit']").click().should("be.disabled");
    cy.get("[data-cy='post-title']").should("contain", postTitle);
    cy.get("[data-cy='post-community']").should("contain.text", communityName);

    // like/unlike post
    let likes: string;
    cy.get("[data-cy='likes']").should(($span) => {
      likes = $span.text();
    });
    cy.get("[data-cy='like-post']").click();
    cy.get("[data-cy='likes']").should(($span) => {
      const newLikes = parseInt($span.text());
      expect(newLikes).to.equal(parseInt(likes) + 1);
    });

    cy.get("[data-cy='like-post']").click();
    cy.get("[data-cy='likes']").should(($span) => {
      const newLikes = parseInt($span.text());
      expect(newLikes).to.equal(parseInt(likes));
    });

    // create comment
    cy.get("[data-cy='create-comment']").contains("Post").should("be.disabled");

    cy.get("textarea").type("         ");
    cy.get("[data-cy='create-comment']").contains("Post").click();
    cy.get("[data-cy='form-error']").should("be.visible");

    cy.get("textarea").type(generateCommentBody());
    cy.get("[data-cy='create-comment']").contains("Post").click();

    // edit comment
    const newCommentBody = generateCommentBody();
    cy.get("[data-cy='comment-edit']").click();
    cy.get("[data-cy='save-comment-edit']").should("be.disabled");
    cy.get("[data-cy='comment-edit-textarea']")
      .should("be.visible")
      .clear()
      .type(newCommentBody);
    cy.get("[data-cy='save-comment-edit']").click();

    // delete comment
    cy.get("[data-cy='comment-delete']").click();
    cy.get("[data-cy='delete-modal']").should("be.visible");
    cy.get("[data-cy='confirm-delete-comment']").click().should("be.disabled");
    cy.get("[data-cy='delete-modal']").should("not.exist");

    // edit post
    const updatedPost = generatePost();
    cy.get("[data-cy='post-edit-link']").click();
    cy.url().should("contain", "/edit");
    cy.get("[data-cy='submit']").should("be.disabled");
    cy.get("[data-cy='edit-post-body']").clear().type(updatedPost.postBody);
    cy.get("[data-cy='submit']").click();

    // delete post
    cy.get("[data-cy='post-edit-link']").click();
    cy.get("[data-cy='post-delete']").click();
    cy.get("[data-cy='delete-modal']").should("be.visible");
    cy.get("[data-cy='confirm-delete-post']").click().should("be.disabled");
  });
});
