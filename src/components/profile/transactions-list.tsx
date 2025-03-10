"use client";

import { motion } from "framer-motion";

const transactions = [
  {
    id: 1,
    type: "Click",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "03.12.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 2,
    type: "Payme",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "21.09.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 3,
    type: "Uzum",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "03.12.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 4,
    type: "Upay",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "21.09.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 5,
    type: "Click",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "03.12.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 6,
    type: "Payme",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "21.09.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 7,
    type: "Uzum",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "03.12.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 8,
    type: "Upay",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "21.09.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 9,
    type: "Click",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "03.12.2024",
    amount: "2 400 000 so'm",
  },
  {
    id: 10,
    type: "Payme",
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    date: "21.09.2024",
    amount: "2 400 000 so'm",
  },
]

export default function TransactionsList() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">№</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">To'lov turi</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Mahsulot nomi</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">To'lov sanasi</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">To'lov miqdori</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <motion.tr
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-6 py-4 text-sm text-gray-700 border-b">{transaction.id}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b">{transaction.type}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b">{transaction.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b">{transaction.date}</td>
              <td className="px-6 py-4 text-sm font-medium text-primary border-b">{transaction.amount}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center mt-6"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m17 18-6-6 6-6" />
              <path d="M7 6v12" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-primary text-white"
          >
            1
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            2
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            ...
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            10
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 18 6-6-6-6" />
              <path d="M17 6v12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}