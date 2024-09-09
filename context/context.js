"use client"
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { BN } from "@project-serum/anchor";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getTicketAddress,
  getTotalPrize
} from "../utils/program";
import { confirmTx, mockWallet } from "@/utils/helper";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [masterAddress, setMasterAddress] = useState(); // store master address
  const[initialized, setInitialized] = useState(false) // flag for master initialized status
  const [lotteryId, setLotteryId] = useState(); // raffleId
  const[lotteryPot, setLotteryPot] = useState(0); // raffle total amount
  const[lottery, setLottery] = useState(); // raffle object
  const[lotteryAddress, setLotteryAddress] = useState(); // raffle public key
  const[userWinningId, setUserWinningId] = useState(false);
  const[lotteryHistory, setLotteryHistory] = useState([]);

  // Connection
  const { connection } = useConnection();
  // Wallet
  const wallet = useAnchorWallet();
  // Program
  const program = useMemo(()=>{
    if(connection) {
      return getProgram(connection, wallet ?? mockWallet()) // use mockWallet in case wallet is undefined 
    }
  },[connection, wallet]);

  useEffect(()=>{
    updateState(); // updates all the state variables in response to any change to program
  },[program]);

  useEffect(()=>{
    if(!lottery) return; // updates the pot state variable in response to any change to lottery
    getPot();
    getHistory();
  }, [lottery]);

  const updateState = async () => {
    if(!program) return;

    try {
      if(!masterAddress) {
        const masterAddress = await getMasterAddress();
        setMasterAddress(masterAddress);
      }
      const master = await program.account.master.fetch(
        masterAddress ??(await getMasterAddress())
      )
      setInitialized(true);
      setLotteryId(master.lastId);
      const lotteryAddress = await getLotteryAddress(master.lastId);
      setLotteryAddress(lotteryAddress);
      const lottery = await program.account.raffle.fetch(lotteryAddress); // Raffle object
      setLottery(lottery);

      if(!wallet?.publicKey) return; // if a public key exists, fetch all the tickets with the below filter
      const userTickets = await program.account.ticket.all();

      // check whether any of the user tickets win
      const userWin = userTickets.some(
        (t) => t.account.id === lottery.winnerId
      );
      if(userWin) {
        setUserWinningId(lottery.winnerId);
      } else {
        setUserWinningId(null);
      }

    } catch(err) {
      console.log("Error : updateState : ", err);
    }
  }

  // Get raffle total pot amount
  const getPot = async () => {
    const pot = getTotalPrize(lottery);
    setLotteryPot(pot);
  }

  // Get winning history
  const getHistory = async () => {
    if (!lotteryId) return

    const history = []

    for (const i in new Array(lotteryId).fill(null)){
      const id = lotteryId - parseInt(i)
      if(!id) break
      const lotteryAddress = await getLotteryAddress(id);
      const lottery = await program.account.raffle.fetch(lotteryAddress);
      const winnerId = lottery.winnerId;
      if(!winnerId) continue;

      const ticketAddress = await getTicketAddress(lotteryAddress, winnerId);
      const ticket = await program.account.ticket.fetch(ticketAddress);

      history.push({
        lotteryId: id,
        winnerId,
        winnerAddress: ticket.owner,
        prize: getTotalPrize(lottery)
      })
    }

    setLotteryHistory(history);
  }

  // Call solana program instructions
  const initMaster = async () => {
    try {
      const txHash = await program.methods
      .initMaster()
      .accounts({
        master: masterAddress, 
        payer: wallet.publicKey, 
        systemProgram: SystemProgram.programId
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState();
      toast.success("Initialized Master!");
    } catch(err) {
      console.log("Error : initMaster : ", err.message);
      toast.error(err.message);
    }
  }

  // Create raffle
  const createLottery = async () => {
    try {
      const lotteryAddress = await getLotteryAddress(lotteryId + 1);
      const txHash = await program.methods
      .createRaffle(new BN(1).mul(new BN(LAMPORTS_PER_SOL))) // change BN(variable) to update entrance fee
      .accounts({
        raffle: lotteryAddress,
        master: masterAddress,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Raffle Created!");

      } catch(err) {
      console.log("Error : createLottery : ", err);
      toast.error(err.message);
    }
  }

  // Buy tickets
  const buyTicket = async () => {
    try{
      const txHash = await program.methods
      .buyTicket(lotteryId)
      .accounts({
        raffle: lotteryAddress,
        ticket: await getTicketAddress(
          lotteryAddress,
          lottery.lastTIcketId + 1
        ),
        buyer: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState();
      toast.success("Ticket bought!");
    } catch(err){
      console.log("Error : buyTicket : ", err.message);
    }
  }

  // Pick winner
  const pickWinner = async () => {
    try{
      const txHash = await program.methods
      .pickWinner(lotteryId)
      .accounts({
        raffle: lotteryAddress,
        authority: wallet.publicKey
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Winner picked!");
    } catch(err) {
      console.log("Error : pickWinner : ", err.message);
      toast.error(err.message);
    }
  }
  // Claim prize
  const claimPrize = async () => {
    try{
      const txHash = await program.methods
      .claimPrize(lotteryId, userWinningId)
      .accounts({
        raffle: lotteryAddress,
        ticket: await getTicketAddress(lotteryAddress, userWinningId),
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState();
      toast.success("Claimed the prize!");
    } catch(err) {
      console.log("Error : claimPrize : ", err.message)
    }
  }

  return (
    <AppContext.Provider
      value={{
        // Put functions/variables you want to bring out of context to App in here
        connected: wallet?.publicKey ? true : false,
        isMasterInitialized: initialized,
        initMaster,
        isLotteryAuthority: wallet && lottery && wallet.publicKey.equals(lotteryAddress),
        isFinished: lottery && lottery.winnerId,
        canClaim: lottery && !lottery.claimed && userWinningId,
        lotteryHistory,
        createLottery,
        lotteryId,
        lotteryPot,
        buyTicket,
        pickWinner,
        claimPrize
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
