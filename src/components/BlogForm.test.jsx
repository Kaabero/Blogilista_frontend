import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm calls the event handler it received as props with the right details when a new blog is created.', async () => {
    const createBlog = jest.fn()
  
    render(<BlogForm createBlog={createBlog} />) 
  
    const title = screen.getByPlaceholderText('write title here')
    const author = screen.getByPlaceholderText('write author here')
    const url = screen.getByPlaceholderText('write url here')
    const createButton = screen.getByText('create')
  
    await userEvent.type(title, 'Test Blog' )
    await userEvent.type(author, 'Test Author' )
    await userEvent.type(url, 'www.katri.fi' )
    await userEvent.click(createButton)

    console.log('mockcalls', createBlog.mock.calls[0][0])
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Blog' )
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author' )
    expect(createBlog.mock.calls[0][0].url).toBe('www.katri.fi' )
  })