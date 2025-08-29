const login = async (page, username, password) => {
  try {
    console.log('Looking for username input...')
    await page.getByTestId('username-input').fill(username)
    console.log('Username input found and filled')
  } catch (error) {
    console.log('Username input NOT found:', error.message)
    throw error
  }

  try {
    console.log('Looking for password input...')
    await page.getByTestId('password-input').fill(password)
    console.log('Password input found and filled')
  } catch (error) {
    console.log('Password input NOT found:', error.message)
    throw error
  }

  try {
    console.log('Looking for login submit button...')
    await page.getByTestId('login-submit-button').click()
    console.log('Login submit button found and clicked')
  } catch (error) {
    console.log('Login submit button NOT found:', error.message)
    throw error
  }

  // Don't wait for any specific result - let the test handle that
  console.log('Login form submitted, letting test handle verification')
}

const createBlog = async (page, title, author, url) => {
  // find text new blog
  await page.getByText('new blog').click()
  await page.waitForSelector('[data-testid="title-input"]', { state: 'visible' })
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await page.getByTestId('submit-form-button').click()
}

module.exports = { login, createBlog }