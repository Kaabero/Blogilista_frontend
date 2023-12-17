import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Error from './components/Error'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

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
  const [creatingVisible, setCreatingVisible] = useState(false)

  

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
        setCreatingVisible(false)
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

  const loginForm = () => (
    <div>
    <h2>log in to application</h2>
    <Notification message={completeMessage} />
    <Error message={errorMessage} />
    <LoginForm
      handleLogin={handleLogin}
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
    />
  </div>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: creatingVisible ? 'none' : '' }
    const showWhenVisible = { display: creatingVisible ? '' : 'none' }
    return (
    <div>
      <h2>blogs</h2>
      <Notification message={completeMessage} />
      <Error message={errorMessage} />
      <p>{user.name} logged in <button onClick={() => logout()}>logout</button> </p> 
      <div style={hideWhenVisible}>
      <button onClick={() => setCreatingVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm 
          addBlog={addBlog} 
          newAuthor={newAuthor} 
          handleAuthorChange={({ target }) => setNewAuthor(target.value)} 
          newTitle= {newTitle} 
          handleTitleChange={({ target }) => setNewTitle(target.value)}  
          newUrl= {newUrl} 
          handleUrlChange={({ target }) => setNewUrl(target.value)} 
        />
        <button onClick={() => setCreatingVisible(false)}>cancel</button>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    )
  }

  return (
    <div>
    {!user && loginForm()}
    {user && blogForm()}'
    </div>
  )
}


export default App