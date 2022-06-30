describe("Post creation", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });
  it("Creates a post", () => {
    cy.visit("/submit");

    cy.get("input").type("Hello, World");

    cy.get("textarea").type(
      `# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`,
    );

    cy.get("button").contains("Post").click().should("be.disabled");
  });
  it("navigate to post", () => {
    cy.visit("/post/hello,-world");
    cy.get("h1").should("have.text", "Hello, World");
  });
});

export {};
