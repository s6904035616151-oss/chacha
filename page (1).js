import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>chacha</h1>
      <p style={{ margin: 0, color: '#555' }}>ระบบสั่งอาหารร้านชา</p>

      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link
          href="/generate-qr"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: '#111',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Generate QR
        </Link>
        <Link
          href="/kitchen"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: '#eee',
            color: '#111',
            textDecoration: 'none',
          }}
        >
          Kitchen
        </Link>
      </nav>
    </main>
  );
}
