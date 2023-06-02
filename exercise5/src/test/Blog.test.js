import React from "react";
import Blog from "../components/Blog";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("title and author rendered", async () => {
  const blog = {
    title: "test blog",
    author: "tester",
    url: "test url",
    likes: 5,
    user: {
      username: "test",
      name: "test",
      id: 1
    }
  };
  const likesHandler = jest.fn();
  const blogsHandler = jest.fn();

  const { container } = render(<Blog blog={blog} handleLikes={likesHandler} setBlogs={blogsHandler} />);
  const div = container.querySelector(".defaultBlog");
  expect(div).toHaveTextContent(blog.title, blog.author);
});

test("url and likes shown after button clicked", async () => {
  const blog = {
    title: "test blog",
    author: "tester",
    url: "test url",
    likes: 5,
    user: {
      username: "test",
      name: "test",
      id: 1
    }
  };

  const likesHandler = jest.fn();
  const blogsHandler = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<Blog blog={blog} handleLikes={likesHandler} setBlogs={blogsHandler} />);
  const button = screen.getByText("show");
  await user.click(button);

  const div = container.querySelector(".detailedBlog");
  expect(div).toHaveTextContent(blog.title, blog.author, blog.url, blog.likes);
});

test("handleLikes handler called twice when button clicked twice", async () => {
  const blog = {
    title: "test blog",
    author: "tester",
    url: "test url",
    likes: 5,
    user: {
      username: "test",
      name: "test",
      id: 1
    }
  };

  const likesHandler = jest.fn();
  const blogsHandler = jest.fn();
  const user = userEvent.setup();

  render(<Blog blog={blog} handleLikes={likesHandler} setBlogs={blogsHandler} />);
  const button = screen.getByText("show");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(likesHandler.mock.calls).toHaveLength(2);
});