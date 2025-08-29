import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'
import { test } from 'vitest'
import { vi } from 'vitest'

const mockHandleAddBlog = vi.fn()

test('addblog function is called with correct parameters', async () => {
  const { container } = render(
    <AddBlogForm handleAddBlog={mockHandleAddBlog} />
  )

  const user = userEvent.setup()
  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  await user.type(titleInput, 'testing')
  await user.type(authorInput, 'vitest')
  await user.type(urlInput, 'localhost')

  const submitButton = container.querySelector('#submit-form-button')
  await user.click(submitButton)

  expect(mockHandleAddBlog).calls = [[{ title: 'testing', author: 'vitest', url: 'localhost' }]]
})