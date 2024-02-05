import Image from "next/image";
import { Inter } from "next/font/google";
import Time from "./components/time";
import PlayButton from "./components/playButton";
import BreakTables from "./breakTable";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={` text-white bg-gray-800 flex min-h-screen flex-col items-center p-24 `}
    >
      <BreakTables />
    </main>
  );
}
