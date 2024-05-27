import { Toaster } from "sonner";
import BottomBar from "../components/BottomBar";
import TopBar from "./TopBar";
import SpeedDial from "./home/SpeedDial";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-[100dvh] overflow-hidden bg-brand-100/20">
      <Toaster />
      <TopBar title="Home" />
      <div className="flex-grow overflow-auto relative">
        <div className="pb-[60px]">{children}</div>{" "}
        {/* Adjusted padding to account for BottomBar height */}
        <SpeedDial />
      </div>
      <BottomBar />
    </main>
  );
}
