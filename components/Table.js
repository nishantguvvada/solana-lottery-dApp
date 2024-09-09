"use client";
import { useAppContext } from "../context/context";
import TableRow from "./TableRow";

const Table = () => {
  const {lotteryHistory} = useAppContext();

  return (
    <div className="grid h-full my-10 place-items-center">
      <div className="max-w-2xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            RAFFLE ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            WINNER ADDRESS
                        </th>
                        <th scope="col" className="px-6 py-3">
                            WINNER ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          PRIZE
                        </th>
                    </tr>
                </thead>
                {lotteryHistory?.map((h, i) => (
                  <TableRow key={i} {...h} />
                ))}
            </table>
        </div>

        {/* <div> 
            <div>
              {lotteryHistory?.length &&
                shortenPk(
                  lotteryHistory[lotteryHistory.length - 1].winnerAddress.toBase58()
                )}
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default Table;
