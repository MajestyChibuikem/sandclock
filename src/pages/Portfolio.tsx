import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Investment {
  id: number
  package_id: number
  package_name: string
  amount: number
  expected_return: number
  roi_percentage: number
  gradient: string
  status: string
  end_date: string
  created_at: string
}

interface Transaction {
  id: number
  type: string
  amount: number
  description: string
  created_at: string
}

const Portfolio = () => {
  const { user, updateUser } = useAuth()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [investmentsRes, transactionsRes] = await Promise.all([
        fetch('http://localhost:3001/api/investments', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const investmentsData = await investmentsRes.json()
      const transactionsData = await transactionsRes.json()

      setInvestments(investmentsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) return

    setDepositing(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3001/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      })

      if (res.ok) {
        const updatedUser = await res.json()
        updateUser(updatedUser)
        setShowDepositModal(false)
        setDepositAmount('')
        fetchData()
      }
    } catch (error) {
      console.error('Deposit failed:', error)
    } finally {
      setDepositing(false)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalExpectedReturn = investments.reduce((sum, inv) => sum + inv.expected_return, 0)
  const activeInvestments = investments.filter(inv => inv.status === 'active')

  if (!user) {
    return (
      <section className="px-6 py-12 bg-black min-h-[calc(100vh-200px)]">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-white text-3xl font-bold mb-4">Your Portfolio</h1>
          <p className="text-gray-400 mb-8">Please login to view your portfolio</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors"
          >
            Login
          </Link>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="px-6 py-12 bg-black min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </section>
    )
  }

  return (
    <section className="px-6 py-12 bg-black min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">Your Portfolio</h1>
          <button
            onClick={() => setShowDepositModal(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors"
          >
            Deposit Funds
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Available Balance</p>
            <p className="text-white text-xl sm:text-2xl font-bold">${user.balance.toFixed(2)}</p>
          </div>
          <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Invested</p>
            <p className="text-white text-xl sm:text-2xl font-bold">${totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Expected Returns</p>
            <p className="text-green-500 text-xl sm:text-2xl font-bold">${totalExpectedReturn.toFixed(2)}</p>
          </div>
          <div className="bg-black border border-white/10 rounded-xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Investments</p>
            <p className="text-white text-xl sm:text-2xl font-bold">{activeInvestments.length}</p>
          </div>
        </div>

        {/* Investments */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Your Investments</h2>
          {investments.length === 0 ? (
            <div className="bg-black border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">You don't have any investments yet</p>
              <Link
                to="/earn"
                className="inline-block px-6 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors"
              >
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((inv) => (
                <div key={inv.id} className="bg-black border border-white/10 rounded-xl overflow-hidden">
                  <div className={`h-20 bg-gradient-to-br ${inv.gradient}`}></div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">{inv.package_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inv.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : inv.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Invested</span>
                        <span className="text-white">${inv.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return</span>
                        <span className="text-green-500">${inv.expected_return.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROI</span>
                        <span className="text-white">{inv.roi_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">End Date</span>
                        <span className="text-white">{new Date(inv.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <div className="bg-black border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card View */}
              <div className="md:hidden space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="bg-black border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.type === 'deposit'
                          ? 'bg-green-500/20 text-green-500'
                          : tx.type === 'investment'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-purple-500/20 text-purple-500'
                      }`}>
                        {tx.type}
                      </span>
                      <span className={`text-sm font-medium ${
                        tx.amount >= 0 ? 'text-green-500' : 'text-red-400'
                      }`}>
                        {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-2">{tx.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block bg-black border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Description</th>
                      <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Amount</th>
                      <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5">
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tx.type === 'deposit'
                              ? 'bg-green-500/20 text-green-500'
                              : tx.type === 'investment'
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-purple-500/20 text-purple-500'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white text-sm">{tx.description}</td>
                        <td className={`px-6 py-4 text-right font-medium ${
                          tx.amount >= 0 ? 'text-green-500' : 'text-red-400'
                        }`}>
                          {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 text-sm">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-black border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full my-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white pr-2">Deposit Funds</h2>
              <button
                onClick={() => {
                  setShowDepositModal(false)
                  setDepositAmount('')
                }}
                className="text-gray-400 hover:text-white flex-shrink-0"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Our Online Secure Payment Processor is currently down. Please use the P2P structure for deposits.
            </p>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-400 text-xs sm:text-sm mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-8 pr-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-green-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount.toString())}
                  className="py-2 text-xs sm:text-sm text-white border border-white/10 rounded-lg hover:border-white/30 transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <button
              onClick={handleDeposit}
              disabled={depositing || !depositAmount}
              className="w-full bg-green-500 text-black font-semibold py-2.5 sm:py-3 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {depositing ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio
