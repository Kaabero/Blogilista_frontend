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
  const [creatingVisible, setCreatingVisible] = useState(false)



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    console.log('user', user)
    console.log('blogobject', blogObject)
    if (!blogObject.title || !blogObject.author || !blogObject.url) {

      setErrorMessage('Please fill the required fields')
      setCompleteMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log('returnedBlog', returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        setCreatingVisible(false)
        setCompleteMessage(`a new blog ${blogObject.title} by ${blogObject.author} added `)
        setTimeout(() => {
          setCompleteMessage(null)
        }, 3000)
      })
      .catch(error => {
        setErrorMessage('something unexpected happened')
        setCompleteMessage(null)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
  }

  const removeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    console.log('removable blog:', blog.title, blog.id)
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      console.log('id', id)
      blogService
        .remove(id)
        .then(response => {
          console.log('response', response)
          const filtered = blogs.filter(blog => blog.id !== id)
          console.log('filtered', filtered)
          setBlogs(filtered)
          setCompleteMessage(`Deleted blog '${blog.title}'`
          )
          setTimeout(() => {
            setCompleteMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrorMessage(
            `Information of blog '${blog.title}' has already been removed from server`
          )
          setCompleteMessage(null)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          setTimeout(() => {
          //location.reload()
          }, 3000)
        })
    }
  }

  const addLikeOf = id => {
    const blog = blogs.find(n => n.id === id)
    console.log('likes', blog.likes)
    const changedBlog = { ...blog, likes: blog.likes+=1 }
    console.log('changedBlog', changedBlog)

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        console.log('returnedblog likes', returnedBlog)
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
        setCompleteMessage('like added ')
        setTimeout(() => {
          setCompleteMessage(null)
        }, 3000)
      })
      .catch(error => {
        setErrorMessage('something unexpected happened')
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
      'you are logged out '
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
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      console.log('user', user)
      setUser(user)
      setUsername('')
      setPassword('')
      setCompleteMessage('you are logged in ')
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
    const sortedBlogs = blogs.sort((a ,b) => b.likes - a.likes)

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
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setCreatingVisible(false)}>cancel</button>
        </div>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={() => addLikeOf(blog.id)}
            remove={() => removeBlog(blog.id)}
            loggedUser={user.username} />
        )}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}


export default App