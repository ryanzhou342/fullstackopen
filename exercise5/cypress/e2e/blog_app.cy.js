describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "ryan",
      name: "ryan",
      password: "ryan"
    };

    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("");
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
        cy.request({
          url: "http://localhost:3003/api/blogs",
          method: "POST",
          headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loggedBlogappUser")).token}`
          },
          body: {
            title: "test blog",
            author: "test blog",
            url: "test blog",
            likes: 0
          }
        });
        cy.visit("");
      });
      // cy.contains("new blog").click();
      // cy.get("#title-input").type("test blog");
      // cy.get("#author-input").type("test blog");
      // cy.get("#url-input").type("test blog");
      // cy.get("#create-button").click();
    });

    it("A blog can be created", function() {
      cy.get(".defaultBlog").should("exist");
    });

    it("A blog can be liked", function() {
      cy.contains("show").click();

      cy.contains("like").click();
      cy.get("[data-cy='likes']").should("contain", 1);
    });

    it("A blog can be deleted", function() {
      cy.contains("show").click();

      cy.contains("delete").click();
      cy.get(".defaultBlog").should("not.exist");
      cy.get(".detailedBlog").should("not.exist");
    });

    it("Blog delete button can only be seen by creator", function() {
      const user2 = {
        username: "ryan2",
        name: "ryan2",
        password: "ryan2"
      };

      cy.request("POST", "http://localhost:3003/api/users", user2);
      cy.request("POST", "http://localhost:3003/api/login", {
        username: "ryan2", password: "ryan2"
      }).then(response => {
        localStorage.setItem("loggedBlogappUser", JSON.stringify(response.body));
      });

      cy.visit("");
      cy.contains("show").click();
      cy.contains("delete").should("not.exist");
    });

    it("Blogs are sorted according to likes", function() {
      cy.request({
        url: "http://localhost:3003/api/blogs",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loggedBlogappUser")).token}`
        },
        body: {
          title: "test 2",
          author: "test 2",
          url: "test 2",
          likes: 2
        }
      });

      cy.request({
        url: "http://localhost:3003/api/blogs",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loggedBlogappUser")).token}`
        },
        body: {
          title: "test 3",
          author: "test 3",
          url: "test 3",
          likes: 3
        }
      });

      cy.visit("");
      cy.get(".defaultBlog").eq(0).should("contain", "test 3");
      cy.get(".defaultBlog").eq(1).should("contain", "test 2");
      cy.get(".defaultBlog").eq(2).should("contain", "test blog");
    });
  });
});