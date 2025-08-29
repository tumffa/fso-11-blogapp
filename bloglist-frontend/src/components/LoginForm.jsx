const loginForm = ({ handleLogin, username, setUsername, password, setPassword }) => (
  <form onSubmit={handleLogin} data-testid="login-form">
    <div>
      username
      <input
        data-testid="username-input"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        data-testid="password-input"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit" data-testid="login-submit-button">login</button>
  </form>
)

export default loginForm