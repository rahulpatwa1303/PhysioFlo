import { Toaster } from "sonner";
import TopBar from "./TopBar";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="h-[100dvh] grow overflo-auto bg-brand-100/20">
          <Toaster />
          <TopBar />
          {children}
        </main>
      </body>
    </html>
  );
}
