export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Pullman Booking System - Web Portal</h1>
      <p>Welcome to the Admin and Secretary Management Dashboard.</p>
      <div style={{ marginTop: '1rem' }}>
        <a href="/login" style={{ marginRight: '1rem' }}>Login</a>
        <a href="/admin">Admin Dashboard</a> | <a href="/secretary" style={{ marginLeft: '1rem' }}>Secretary Dashboard</a>
      </div>
    </main>
  );
}
