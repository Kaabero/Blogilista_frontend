import { useState } from 'react'


const BlogForm = ({ createBlog }) => {
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>title: <input value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          placeholder='write title here'
        />
        </div>
        <div>author: <input value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder='write author here'
        />
        </div>
        <div>url: <input value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          placeholder='write url here'
        />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}


export default BlogForm