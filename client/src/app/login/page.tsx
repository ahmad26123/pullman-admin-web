export default function LoginPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <form>
        <div>
          <label>Username: </label>
          <input type="text" name="username" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Password: </label>
          <input type="password" name="password" />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>
    </main>
  );
}
