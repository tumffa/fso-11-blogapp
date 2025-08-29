const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (best, blog) => {
        return best.likes > blog.likes
            ? best
            : blog
    }
    return blogs.length === 0
        ? {}
        : blogs.reduce(reducer, {likes: -1})
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const blogCounts = lodash.countBy(blogs, 'author')
    const maxAuthor = lodash.maxBy(lodash.keys(blogCounts), author => blogCounts[author])

    return {
        author: maxAuthor,
        blogs: blogCounts[maxAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const likeCounts = lodash.groupBy(blogs, 'author')
    const likes = lodash.mapValues(likeCounts, authorBlogs => totalLikes(authorBlogs))
    const maxAuthor = lodash.maxBy(lodash.keys(likes), author => likes[author])

    return {
        author: maxAuthor,
        likes: likes[maxAuthor]
    }
}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}