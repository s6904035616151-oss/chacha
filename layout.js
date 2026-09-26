export const metadata = {
  title: 'chacha',
  description: 'ระบบสั่งอาหารร้านชา chacha',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
