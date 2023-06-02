import React from "react";
import BlogForm from "../components/BlogForm";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("blog form works with right details", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();
  const { container } = render(<BlogForm createBlog={createBlog} />);
  const titleInput = container.querySelector("#title-input");
  const authorInput = container.querySelector("#author-input");
  const urlInput = container.querySelector("#url-input");
  const button = screen.getByText("create");

  await user.type(titleInput, "test blog");
  await user.type(authorInput, "test author");
  await user.type(urlInput, "test url");
  await user.click(button);

  expect(createBlog.mock.calls[0][0].title).toBe("test blog");
  expect(createBlog.mock.calls[0][0].author).toBe("test author");
  expect(createBlog.mock.calls[0][0].url).toBe("test url");
});