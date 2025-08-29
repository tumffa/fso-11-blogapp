import React, { useState } from 'react'

const AddBlogForm = ({ handleAddBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleAddBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit} id="add-blog-form" data-testid="add-blog-form">
        <div>
          title:
          <input
            data-testid="title-input"
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleChange}
            id="title-input"
          />
          <br />
          author:
          <input
            data-testid="author-input"
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleChange}
            id="author-input"
          />
          <br />
          url:
          <input
            data-testid="url-input"
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleChange}
            id="url-input"
          />
        </div>
        <button
          type="submit"
          id="submit-form-button"
          data-testid="submit-form-button"
        >
          create
        </button>
      </form>
    </div>
  )
}

export default AddBlogForm