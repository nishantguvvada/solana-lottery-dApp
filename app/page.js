"use client";
import PotCard from "@/components/PotCard";
import Header from "@/components/Header";
import Table from "@/components/Table";
import { AppProvider } from "@/context/context";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppProvider>
            <div>
              {/* <Background/> */}
              <Header/>
              <PotCard/>
              <Table/>
            </div>
          </AppProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
