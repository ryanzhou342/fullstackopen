import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
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

  const handleCreate = async (event) => {
    event.preventDefault();

    const createdBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(createdBlog));
    setNewBlog({
      title: "",
      author: "",
      url: ""
    });
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
              <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
              <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in</p>
      <button type="submit" onClick={handleLogout}>logout</button>

      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input type="text" value={newBlog.title} name="title" onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} />
        </div>
        <div>
          author:
            <input type="text" value={newBlog.author} name="author" onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} />
        </div>
        <div>
          url:
            <input type="text" value={newBlog.url} name="url" onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App