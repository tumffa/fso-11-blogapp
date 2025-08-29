const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'FSO',
        author: 'Matti Luukkainen',
        url: 'https://fullstackopen.com/',
        likes: 10
    },
    {
        title: 'Containers',
        author: 'Jami Kousa',
        url: 'https://fullstackopen.com/en/part12',
        likes: 5
    }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash("123", saltRounds)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body.map(({ title, author, url, likes }) => ({ title, author, url, likes }))
  
  assert.deepStrictEqual(blogs.length, initialBlogs.length)
})

test('returned blog has string id value', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert.ok(blog.id)
  assert.strictEqual(typeof blog.id, 'string')
})

test('a new blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Author',
    url: 'https://newblog.com/',
    likes: 0
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expectedBlogUserName = response.body[2].user.username
  assert.deepStrictEqual(expectedBlogUserName, 'root')
})

test('blog likes is 0 if not provided', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Author',
    url: 'https://newblog.com/'
  }

  const response = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blog = response.body
  assert.strictEqual(blog.likes, 0)
})

test('blog must have title and url', async () => {
  const newBlog = {
    author: 'Author',
    likes: 0
  }

  response = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
  
  assert.strictEqual(response.status, 400)
})

test ('a blog can be deleted with id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  await api.delete(`/api/blogs/${blog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogs = await api.get('/api/blogs')
  assert.strictEqual(blogs.body.length, initialBlogs.length - 1)
})

test('adding blog fails without token', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Author',
    url: 'https://newblog.com/',
    likes: 0
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.ok(!titles.includes('New blog'))
})

after(async () => {
  await mongoose.connection.close()
})