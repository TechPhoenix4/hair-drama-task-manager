export const metadata = {
  title: 'Hair Drama Task Manager',
  description: 'Task manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}