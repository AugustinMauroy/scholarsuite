import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';
import '@/styles/globals.css';

const metadata: Metadata = {
  title: 'Example App',
  description: "Next.js example app. It's awesome!",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export { metadata };
export default RootLayout;
