"use client"
import React, { useState } from "react";
import {
  address,
} from "gill";
import { handleSend } from "../actions/send";

export default function InstructionTester() {
  const [destination, setDestination] = useState("")
  const [msg, setMsg] = useState("")

  const handleClick = async () => {
    setMsg(" ")
    const msg = await handleSend(address(destination));
    setMsg(msg)
  }
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Solana Instruction Builder Test
        </h1>

        <p className="text-sm text-gray-600 text-center">
          Send a small SOL transfer using your private key (Devnet)
        </p>

        <input
          type="text"
          placeholder="Destination address"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
        />

        <button
          disabled={msg == " "}
          onClick={handleClick}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-100 text-white font-medium py-2 rounded-lg transition"
        >
          Send Test Transaction
        </button>

        <p className="text-center text-sm font-medium p-2 rounded-lg ">{msg}</p>

        {/* {status && (
          <div
            className={`text-center text-sm font-medium p-2 rounded-lg ${
              status.startsWith("Success")
                ? "text-green-700 bg-green-50"
                : status.startsWith("Error")
                ? "text-red-700 bg-red-50"
                : "text-gray-700 bg-gray-50"
            }`}
          >
            {status}
          </div>
        )} */}
      </div>
    </div>
  );
}
