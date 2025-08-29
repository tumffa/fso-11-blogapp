const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    response.status(500).json({ error: 'Something went wrong' })
  }
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'Missing title or url' })
  }
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const body = request.body
  const user = request.user
  body.user = user._id.toString()
  const blog = new Blog(body)
  const result = await blog.save()
  user.blogs = user.blogs || []
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  const populatedBlog = await Blog.findById(result._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  token = request.token
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
    response.status(200).json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error: 'Something went wrong' })
  }
})

module.exports = blogsRouter