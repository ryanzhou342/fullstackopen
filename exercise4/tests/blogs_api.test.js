const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const initialBlogs = [
  {
    title: "1",
    author: "1",
    url: "1",
    likes: 5
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  
  const blogObjects = initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test("correct amount of blogs returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(1);
});

test("id is correctly named and defined", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("post request makes new blog", async () => {
  const newBlog = {
    title: "2",
    author: "2",
    url: "1",
    likes: 5
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await Blog.find({});
  blogsAtEnd = blogs.map(blog => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).toContain("2");
});

test("likes defaults to 0", async () => {
  const newBlog = {
    title: "3",
    author: "3",
    url: "3"
  };

  await api
    .post("/api/blogs")
    .send(newBlog);
  
  const blogs = await Blog.find({});
  expect(blogs[1].toJSON().likes).toBe(0);
});

test("url or title missing", async () => {
  let newBlog = {
    title: undefined,
    author: "4",
    url: "4",
    likes: 5
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);
  
  newBlog.title = "4";
  delete newBlog.url;

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);
});

test("a blog can be deleted", async () => {
  let blogs = await Blog.find({});
  const blogsAtStart = blogs.map(blog => blog.toJSON());
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  blogs = await Blog.find({});
  const blogsAtEnd = blogs.map(blog => blog.toJSON());
  
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).not.toContain(blogToDelete.title);
});

test("a blog can be updated", async () => {
  let blogs = await Blog.find({});
  const blogsAtStart = blogs.map(blog => blog.toJSON());
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 4
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200);

  blogs = await Blog.find({});
  const blogsAtEnd = blogs.map(blog => blog.toJSON());
  expect(blogs[0].likes).toBe(4);
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("ryan", 10);
    const user = new User({
      username: "ryan",
      passwordHash
    });

    await user.save();
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ryan",
      name: "ryan",
      password: "ryan"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails with proper statuscode if password is less than 3", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "wontwork",
      name: "wontwork",
      password: "12"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toBe("password must be of at least length 3");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails with proper statuscode if username is less than 3", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "1",
      name: "wontwork",
      password: "1234"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    expect(result.body.error).toContain("shorter than the minimum allowed length");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});