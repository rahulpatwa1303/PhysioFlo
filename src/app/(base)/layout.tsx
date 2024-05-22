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
        <TopBar />
        <main className="h-screen grow">{children}</main>
        <BottomBar />
      </body>
    </html>
  );
}
