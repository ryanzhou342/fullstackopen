describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "ryan",
      name: "ryan",
      password: "ryan"
    };

    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type("ryan");
      cy.get("#password").type("ryan");
      cy.get("#login-button").click();

      cy.contains("ryan logged in");
    });

    it("fails with wrong credentials", function() {
      cy.get("#username").type("what");
      cy.get("#password").type("what");
      cy.get("#login-button").click();

      cy.contains("Wrong username or password");
    });
  });

  describe("When logged in", function() {
    beforeEach(function() {
      cy.request("POST", "http://localhost:3003/api/login", {
        username: "ryan", password: "ryan"
      }).then(response => {
        localStorage.setItem("loggedBlogappUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
      });
    });

    it("A blog can be created", function() {
      cy.contains("new blog").click();
      cy.get("#title-input").type("test blog");
      cy.get("#author-input").type("test blog");
      cy.get("#url-input").type("test blog");

      cy.get("#create-button").click();
      cy.get(".defaultBlog").should("exist");
    });
  });
});