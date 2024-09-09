"use client";
import { shortenPk } from "../utils/helper";

const TableRow = ({
  lotteryId,
  winnerAddress = "4koeNJ39zejjuCyVQdZmzsx28CfJoarrv4vmsuHjFSB6",
  winnerId,
  prize,
}) => {
  return (
      <tbody>
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {lotteryId}
          </th>
          <td className="px-6 py-4">
            {shortenPk(winnerAddress)}
          </td>
          <td className="px-6 py-4">
            {winnerId}
          </td>
          <td className="px-6 py-4">
            +{prize} SOL
          </td>
        </tr>
      </tbody>
  );
};

export default TableRow;
