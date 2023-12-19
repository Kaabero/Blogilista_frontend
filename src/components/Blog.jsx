import { useState } from 'react'

const Blog = ({ blog }) => {
  console.log('blog.user', blog.user)
  const [showingVisible, setShowingVisible] = useState(false)
  const hideWhenVisible = { display: showingVisible ? 'none' : '' }
  const showWhenVisible = { display: showingVisible ? '' : 'none' }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>  
      <div>
        Title: {blog.title} <br>
        </br>
        <div style={hideWhenVisible}>
        <button onClick={() => setShowingVisible(true)}>view</button>
        </div>
        <div style={showWhenVisible}>
        Author: {blog.author} <br>
        </br>
        URL: {blog.url} <br>
        </br>
        likes: {blog.likes} <button onClick={() => addLike()}>like</button><br>
        </br>
        Added by: {blog.user.name} <br>
        </br>
        <button onClick={() => setShowingVisible(false)}>hide</button>
        </div>
      </div>
    </div>  
)}


export default Blog