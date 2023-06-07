import { useState } from "react";
import blogService from "../services/blogs";

import PropTypes from "prop-types";

const Blog = ({ blog, handleLikes, setBlogs }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };

  if (!visible) {
    return (
      <div style={blogStyle} className="defaultBlog">
        {`${blog.title} ${blog.author}`}
        <button onClick={() => {setVisible(!visible);}}>show</button>
      </div>
    );
  }

  const handleDelete = async (event) => {
    event.preventDefault();

    if (window.confirm("Delete blog " + blog.title + " by " + blog.author)) {
      await blogService.remove(blog.id);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
    }
  };

  return (
    <div style={blogStyle} className="detailedBlog">
      <div>
        <span>
          {`${blog.title} ${blog.author}`}
        </span>
        <button onClick={() => {setVisible(!visible);}}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div data-cy="likes">
        {blog.likes}
        <button onClick={(event) => handleLikes(event, blog.likes, blog.id)}>like</button>
      </div>
      <div>{blog.user.name}</div>
      <div>
        {blog.user.username === JSON.parse(window.localStorage.getItem("loggedBlogappUser")).username && <button onClick={handleDelete}>delete</button>}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired
};

export default Blog;