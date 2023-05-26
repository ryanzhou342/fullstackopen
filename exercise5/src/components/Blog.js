import { useState } from "react";
import blogService from "../services/blogs";

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
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => {setVisible(!visible)}}>show</button>
      </div> 
    ); 
  }

  const handleDelete = async (event) => {
    event.preventDefault();

    await blogService.remove(blog.id);
    const updatedBlogs = await blogService.getAll();
    setBlogs(updatedBlogs);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={() => {setVisible(!visible)}}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        {blog.likes}
        <button onClick={(event) => handleLikes(event, blog.likes, blog.id)}>like</button>
      </div>
      <div>{blog.user.name}</div>
      <div>
        <button onClick={handleDelete}>delete</button>
      </div>
    </div>
  )
}

export default Blog