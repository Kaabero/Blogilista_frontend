import { useState } from 'react'


const Blog = ({ blog, addLike, remove, loggedUser }) => {


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
        Author: {blog.author} <br />
      
        URL: {blog.url} <br />
        
        likes: {blog.likes} <button onClick={addLike}>like</button><br />
        
        Added by: {blog.user.name} <br />
        
        {loggedUser === blog.user.username && <><button onClick={remove}>remove</button> <br /></>}
        
        <button onClick={() => setShowingVisible(false)}>hide</button>
        </div>
      </div>
    </div>  
)}


export default Blog