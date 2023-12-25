import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.katri.fi',
    likes: 1,
    user: {
        username: "testuser",
        name: "Test User",
        id: "1"
    }
  }

  const mockAddLike = jest.fn()
  const mockRemove = jest.fn()

  render(<Blog blog={blog} addLike={mockAddLike} remove={mockRemove} loggedUser='testuser' />)

  const element = screen.getByText('Title: Test Blog')
  expect(element).toBeDefined()
})

test('renders blog author, url, likes and user after clicking view button', async () => {
    
    const blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'www.katri.fi',
      likes: 1,
      user: {
        name: 'Test User',
        username: 'testuser',
        id: 1
      },
    }
  
    const mockAddLike = jest.fn()
    const mockRemove = jest.fn()

    const user = userEvent.setup()
  
    render(
      <Blog blog={blog} addLike={mockAddLike} remove={mockRemove} loggedUser="testuser" />
    )
  

    await user.click(screen.getByText('view'))

    expect(screen.getByText(blog.url, {exact: false}))
    expect(screen.getByText(blog.author, {exact: false}))
    expect(screen.getByText(blog.likes, {exact: false}))
    expect(screen.getByText(blog.user.name, {exact: false}))
  })

  test('clicking the like button calls event handler twice', async () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'www.katri.fi',
        likes: 1,
        user: {
          name: 'Test User',
          username: 'testuser',
          id: 1
        },
      }
    
    const mockAddLike = jest.fn()
    const mockRemove = jest.fn()
    
    render(
        <Blog blog={blog} addLike={mockAddLike} remove={mockRemove} loggedUser="testuser" />
    )
    

  
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    
  
    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
  