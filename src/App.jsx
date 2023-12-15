import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="complete">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const BlogForm = ({addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange, newUrl, handleUrlChange}) => {
  return (
    <form onSubmit={addBlog}>
    <div>title: <input value={newTitle} 
    onChange={handleTitleChange} 
    />
    </div>
    <div>author: <input value={newAuthor}
    onChange={handleAuthorChange}
    />
    </div>
    <div>url: <input value={newUrl}
    onChange={handleUrlChange}
    />
    </div>
    <button type="submit">create</button>
  </form>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [completeMessage, setCompleteMessage] = useState(null)
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')

  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    console.log(blogObject)
    if (!blogObject.title || !blogObject.author || !blogObject.url) {
  
      setErrorMessage(`Please fill the required fields`)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setCompleteMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
    }
 
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setCompleteMessage(
          `a new blog ${newTitle} by ${newAuthor} added `
        )
        setTimeout(() => {
          setCompleteMessage(null)
        }, 3000)
    
      })
      .catch(error => {
        setErrorMessage(`something unexpected happened`)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setCompleteMessage(null)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })      
  }
  

  const logout = () => {
    console.log('logging out')
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.clear()
    setCompleteMessage(
      `you are logged out `
    )
    setTimeout(() => {
      setCompleteMessage(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      console.log('user', user)
      setUser(user)
      setUsername('')
      setPassword('')
      setCompleteMessage(`you are logged in `)
      setTimeout(() => {
        setCompleteMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
    
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={completeMessage} />
        <Error message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={completeMessage} />
      <Error message={errorMessage} />
      <p>{user.name} logged in <button onClick={() => logout()}>logout</button> </p> 
      <h2>create new</h2>
      <BlogForm 
          addBlog={addBlog} 
          newAuthor={newAuthor} 
          handleAuthorChange={handleAuthorChange} 
          newTitle= {newTitle} 
          handleTitleChange={handleTitleChange} 
          newUrl= {newUrl} 
          handleUrlChange={handleUrlChange} 
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App