import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [resultNotification, setResultNotification] = useState([null, true])

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setResultNotification([`welcome ${user.name}`, true])
      resetNotification()
    }
    catch (exception) {
      console.log('wrong credentials')
      setResultNotification(['wrong username or password', false])
      resetNotification()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setResultNotification(['logged out', true])
    resetNotification()
  }

  const handleAddBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      const updatedBlogs = blogs.concat(addedBlog).sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
      setResultNotification([`a new blog ${addedBlog.title} by ${addedBlog.author} added`, true])
      setTimeout(() => {
        setResultNotification([null, true])
      }, 3000)
    } catch (exception) {
      console.log('Error adding blog:', exception)
      setResultNotification(['Error adding blog', false])
      setTimeout(() => {
        setResultNotification([null, true])
      }, 3000)
    }
  }

  const handleLike = async (blog) => {
    const newBlog = {
      'user': blog.user.id,
      'likes': blog.likes + 1,
      'author': blog.author,
      'title': blog.title,
      'url': blog.url
    }
    try {
      const updatedBlog = await blogService.update(blog.id, newBlog)
      const updatedBlogs = blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog).sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (exception) {
      console.log('Error updating blog:', exception)
      setResultNotification(['Error updating blog', false])
      setTimeout(() => {
        setResultNotification([null, true])
      }, 3000)
    }
  }

  const resetNotification = () => {
    setTimeout(() => {
      setResultNotification([null, true])
    }, 3000)
  }

  const handleDeleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      const updatedBlogs = blogs.filter(b => b.id !== blog.id)
      setBlogs(updatedBlogs)
      setResultNotification([`Blog ${blog.title} by ${blog.author} removed`, true])
      resetNotification()
    } catch (exception) {
      console.log('Error deleting blog:', exception)
      setResultNotification(['Error deleting blog', false])
      resetNotification()
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={resultNotification[0]} error={resultNotification[1]} data-testid="notification"/>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={resultNotification[0]} error={resultNotification[1]} />
        <p>{user.name} logged in <button onClick={handleLogout} data-testid="logout-button">logout</button></p>
        <Togglable buttonLabel="new blog" ref={blogFormRef} data-testid="create-new-blog-button">
          <AddBlogForm handleAddBlog={handleAddBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => handleLike(blog)}
            handleDelete={() => handleDeleteBlog(blog)}
            user={user} />
        )}
      </div>
    )
  }
}

export default App