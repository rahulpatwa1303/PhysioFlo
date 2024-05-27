import { Toaster } from "sonner";
import TopBar from "../(base)/TopBar";
import BottomBar from "../components/BottomBar";


export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col h-[100dvh] overflow-hidden bg-brand-100/20">
          <Toaster />
          <TopBar title={'Profile'}/>
          <div className="flex-grow overflow-auto relative">
            <div className="pb-[60px]">{children}</div>
          </div>
          <BottomBar />
        </main>
      </body>
    </html>
  );
}
