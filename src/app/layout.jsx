import "./globals.css";

export const metadata = {
  title: "Explore Wisdom | KataKata",
  description:
    "KataKata - Tempat menemukan inspirasi, filosofi, dan kata-kata bijak pilihan untuk jiwa yang ingin terus belajar.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-[#e4e1ed] overflow-x-hidden font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
