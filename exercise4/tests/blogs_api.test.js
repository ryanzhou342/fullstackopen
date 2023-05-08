const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const Blog = require("../models/blog");

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