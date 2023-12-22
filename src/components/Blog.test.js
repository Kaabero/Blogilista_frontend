import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Katri',
    url: 'www.katri.fi',
    likes: 1,
    user: {
        username: "Katri",
        name: "Katri",
        id: "1"
    }
  }

  render(<Blog blog={blog} loggedUser='Katri' />)

  const element = screen.getByText('Title: Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})