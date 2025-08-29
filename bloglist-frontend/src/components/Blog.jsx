import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)} id="view-button">{visible ? 'hide' : 'view'} </button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} id="blog-details">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLike} id="like-button">like</button>
        </div>
        {blog.user && blog.user.username && (
          <div>{blog.user.username}</div>
        )}
      </div>
      <div>
        {user && blog.user && blog.user.username === user.username && (
          <button onClick={handleDelete} data-testid="remove-button">remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog