"use client";

import { useState } from "react";

// Define proper types
interface EthTransaction {
  hash: string;
  from: string;
  to: string;
}

interface SolTransaction {
  txHash: string;
  signer?: string;
  parsedInstruction?: {
    programId: string;
  };
}

type Transaction = EthTransaction | SolTransaction;

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      if (!address) throw new Error("Enter a wallet address");

      const isETH = address.startsWith("0x");

      if (isETH) {
        // const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
        const apiKey = "75ZK11HCA8J245C8BXV2DEVZ37466VM74W";

        const balRes = await fetch(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
        );
        const balData = await balRes.json();
        setBalance(Number(balData.result) / 1e18);

        const txRes = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );
        const txData = await txRes.json();
        setTxns((txData.result || []).slice(0, 5));
      } else {
        const balRes = await fetch(
          `https://public-api.solscan.io/account/${address}`
        );
        const balData = await balRes.json();
        setBalance(balData.lamports / 1e9);

        const txRes = await fetch(
          `https://public-api.solscan.io/account/transactions?account=${address}&limit=5`
        );
        const txData = await txRes.json();
        setTxns(txData || []);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-start p-6 text-white">
      <div className="w-full max-w-2xl">
        {/* Header with AI vibe */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Wallet Explorer
          </h1>
          <p className="text-blue-200">Powered by Neural Blockchain Analysis</p>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-16 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
            <div className="h-1 w-16 bg-purple-500 rounded-full mr-1 animate-pulse delay-150"></div>
            <div className="h-1 w-16 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Search section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl border border-gray-700">
          <div className="flex gap-3 mb-4 w-full">
            <input
              type="text"
              className="flex-1 border border-gray-600 rounded-xl p-3 text-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter ETH or SOL wallet address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Scan Wallet
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-xl p-3 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Balance section */}
        {balance !== null && (
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-2xl p-6 mb-6 shadow-2xl border border-blue-700 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-semibold">WALLET BALANCE</p>
                <p className="text-2xl font-bold mt-1">{balance}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Transactions section */}
        {txns.length > 0 && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold mr-2">Transaction History</h2>
              <span className="bg-blue-500 bg-opacity-20 text-blue-300 text-xs px-2 py-1 rounded-full">
                Last 5
              </span>
            </div>

            <div className="space-y-4">
              {txns.map((tx, i) => (
                <div key={i} className="bg-gray-700 bg-opacity-50 rounded-xl p-4 border border-gray-600 hover:border-blue-500 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${i % 2 === 0 ? 'bg-green-900 bg-opacity-30' : 'bg-blue-900 bg-opacity-30'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Transaction {i + 1}</p>
                        <p className="text-xs text-gray-400 font-mono truncate max-w-xs">
                          {"hash" in tx ? tx.hash : tx.txHash}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                      {i % 2 === 0 ? 'IN' : 'OUT'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">From</p>
                      <p className="font-mono text-xs truncate">
                        {"from" in tx ? tx.from : tx.signer}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">To</p>
                      <p className="font-mono text-xs truncate">
                        {"to" in tx ? tx.to : tx.parsedInstruction?.programId}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animated background elements for AI vibe */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
