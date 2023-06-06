import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const blogFormRef = useRef();
  console.log("rendered");
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });

      window.localStorage.setItem(
        "loggedBlogappUser", JSON.stringify(user)
      );

      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (e) {
      setMessage("Wrong username or password");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleLikes = async (event, currentLikes, id) => {
    event.preventDefault();

    const blog = blogs.find(blog => blog.id === id);
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    await blogService.put(id, updatedBlog);
    const newBlogs = await blogService.getAll();
    setBlogs(newBlogs);
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    await blogService.create(newBlog);
    const newBlogs = await blogService.getAll();
    setBlogs(newBlogs);
    setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input id="username" type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input id="password" type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in</p>
      <button type="submit" onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.sort((blog1, blog2) => (blog2.likes - blog1.likes)).map(blog => {
        return (<Blog key={blog.id} blog={blog} handleLikes={handleLikes} setBlogs={setBlogs} />);
      })}
    </div>
  );
};

export default App;