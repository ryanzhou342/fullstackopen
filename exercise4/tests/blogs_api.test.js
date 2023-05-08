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