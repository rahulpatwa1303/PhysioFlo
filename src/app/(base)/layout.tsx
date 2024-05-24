import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import SpeedDial from "./home/SpeedDial";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="h-screen grow overflo-auto">
          <TopBar />
          {children}
          <SpeedDial />
          <BottomBar />
        </main>
      </body>
    </html>
  );
}
