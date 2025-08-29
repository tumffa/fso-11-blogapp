const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Try to logout if user is logged in from previous test
    try {
      await page.goto('http://localhost:5173')
      await page.getByTestId('logout-button').click({ timeout: 1000 })
      console.log('Logged out from previous session')
    } catch (error) {
      console.log('No previous session or already logged out')
    }
    
    // Clear local storage and reload page
    await page.evaluate(() => window.localStorage.clear())
    console.log('Local storage cleared')
    
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    console.log('Reset response:', resetResponse.status(), await resetResponse.text())
    
    const user1Response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    console.log('User 1 response:', user1Response.status(), await user1Response.text())
    
    const user2Response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    })
    console.log('User 2 response:', user2Response.status(), await user2Response.text())

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('username-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('login-submit-button')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'wrong password')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await expect(page.getByText('a new blog test title by test author added')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.getByText('test title').locator('..').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.getByTestId('remove-button').click()
      await expect(page.getByText('Blog test title by test author removed')).toBeVisible()
    })

    test('remove button is only shown if user created the blog', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await page.getByTestId('logout-button').click()
      await login(page, 'testuser', 'testpassword')
      await expect(page.getByTestId('remove-button')).not.toBeVisible()
    })
  })
})