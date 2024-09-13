"use client";
// import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import { useAppContext } from "../context/context";
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletDisconnectButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
  { ssr: false }
);

const PotCard = () => { 

  const {
    connected,
    isMasterInitialized,
    initMaster,
    isLotteryAuthority,
    isFinished,
    canClaim,
    lotteryHistory,
    createLottery,
    lotteryId,
    lotteryPot,
    buyTicket,
    pickWinner,
    claimPrize,
  } = useAppContext();

  if (!isMasterInitialized)
    return (
      <div className="grid h-full gap-10 place-items-center mt-20 block max-w-full p-6 bg-white rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Raffle #{lotteryId}
        </h5>
        {connected ? (
          <>
            <button onClick={initMaster} type="button" className="w-60 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Initialize master</button>
          </>
        ) : (
          <div className="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex gap-4 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <WalletMultiButtonDynamic/> {/* <WalletMultiButton/> */}
              <WalletDisconnectButtonDynamic/> {/* <WalletDisconnectButton/> */}
            </div>
          </div>
        )}
      </div>
    );

  return (
    <div className="grid h-full gap-10 place-items-center mt-20 block max-w-full p-6 bg-white rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <Toaster />
      <div className="mt-10 max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="rounded-3xl relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">RAFFLE</h5>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">STATUS</h5>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">PRIZE</h5>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="text-center px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{lotteryId}</h5>
                        </th>
                        <td className="text-center px-6 py-4">
                          {!isFinished ? <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">LIVE</h5> : <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">CLOSED</h5>}
                        </td>
                        <td className="text-center px-6 py-4 font-bold">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{lotteryPot}</h5>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        {!isFinished ? <h5 className="text-center my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Raffle {lotteryId} is live, join now!</h5> : <h5 className="text-center my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">WAIT TILL NEXT RAFFLE!</h5>}
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Join here to be a part of the biggest blockchain secured raffle!</p>
        <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
        </a>
      </div>
      <div className="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {connected ? (
          <>
            {!isFinished && (
              <div>
                <button onClick={buyTicket} type="button" className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Enter</button>
              </div>
            )}

            {isLotteryAuthority && !isFinished && (
              <div>
                <button onClick={pickWinner} type="button" className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Pick Winner</button>
              </div>
            )}

            {canClaim && (
              <div>
                <button onClick={claimPrize} type="button" className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Claim prize</button>
              </div>
            )}

            <div>
              <button onClick={createLottery} type="button" className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Create lottery</button>
            </div>
          </>
        ) : (
          <div className="flex gap-4 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <WalletMultiButtonDynamic/> {/* <WalletMultiButton/> */}
            <WalletDisconnectButtonDynamic/> {/* <WalletDisconnectButton/> */}
          </div>
        )}
      </div>
      </div>
  );
  
};

export default PotCard;
