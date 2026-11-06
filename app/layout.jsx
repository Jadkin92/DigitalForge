import './globals.css';

export const metadata = {
  title: 'The Digital Forge | Web Design, Operational Improvement & FinTech Business Analysis',
  description:
    'The Digital Forge builds websites, digital operations tools and booking/invoicing software for small and medium businesses, and provides contract Business Analysis for FinTech organisations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
