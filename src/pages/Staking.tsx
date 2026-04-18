import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'
import logoIcon from '../images/image.png'

interface Investment {
  id: number
  package_name: string
  amount: number
  expected_return: number
  roi_percentage: number
  status: string
  end_date: string
}

const Staking = () => {
  const { user, token, updateUser } = useAuth()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loadingInvestments, setLoadingInvestments] = useState(false)
  const [withdrawing, setWithdrawing] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stats = [
    { label: 'TVL', value: '50.6K' },
    { label: 'Chain', value: 'Ethereum' },
    { label: 'Lockup', value: '0 days' },
    { label: 'Multiplier Points', value: '0.0000' },
    { label: 'Reward Token', value: 'wETH' },
    { label: 'Address', value: '0x0A...55D8', copyable: true },
  ]

  useEffect(() => {
    if (user && token) fetchInvestments()
  }, [user, token])

  const fetchInvestments = async () => {
    setLoadingInvestments(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/investments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setInvestments(Array.isArray(data) ? data.filter((i: Investment) => i.status === 'active') : [])
      }
    } catch {
      // silently fail
    } finally {
      setLoadingInvestments(false)
    }
  }

  const handleWithdraw = async (investmentId: number) => {
    setWithdrawing(investmentId)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/investments/${investmentId}/withdraw`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        updateUser(data.user)
        setInvestments(prev => prev.filter(i => i.id !== investmentId))
      } else {
        setError(data.error || 'Withdrawal failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setWithdrawing(null)
    }
  }

  return (
    <section className="px-4 sm:px-6 py-6 sm:py-8 bg-black min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <img src={logoIcon} alt="QUARTZ" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
          <h1 className="text-white text-xl sm:text-2xl font-bold">QUARTZ Staking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left side - TVL Chart and Stats */}
          <div className="bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">TVL</p>
            <p className="text-green-500 text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">50.6K</p>

            {/* Dot pattern visualization */}
            <div className="h-32 mb-6 overflow-hidden">
              <style>{`
                @keyframes subtle-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3px); }
                }
                .bounce-dot { animation: subtle-bounce 1.2s ease-in-out infinite; }
              `}</style>
              <div className="grid grid-cols-[repeat(40,1fr)] gap-1">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i < 160 ? 'bg-green-500 bounce-dot' : 'bg-gray-700'}`}
                    style={{ animationDelay: `${(i % 8) * 0.15}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-gray-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-white text-xs sm:text-sm font-medium break-words">{stat.value}</p>
                    {stat.copyable && (
                      <button className="text-gray-500 hover:text-white">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Withdraw Staked Packages */}
          <div className="bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col">
            <h2 className="text-white text-base sm:text-lg font-semibold mb-1">Withdraw Staked Packages</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
              Claim your returns from active investment packages.
            </p>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                <p className="text-gray-400 text-sm text-center">Log in to view and withdraw your staked packages.</p>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm"
                >
                  Log In
                </Link>
              </div>
            ) : loadingInvestments ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading your packages...</p>
              </div>
            ) : investments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                <p className="text-gray-400 text-sm text-center">No active staked packages found.</p>
                <Link
                  to="/earn"
                  className="px-6 py-2.5 bg-green-500 text-black font-medium rounded-xl hover:bg-green-400 transition-colors text-sm"
                >
                  Explore Packages
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-80 pr-1">
                {error && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                )}
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-black border border-white/10 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm">{inv.package_name}</span>
                      <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                        {inv.roi_percentage}% ROI
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500 mb-0.5">Invested</p>
                        <p className="text-white font-medium">${inv.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Expected Return</p>
                        <p className="text-green-400 font-medium">${inv.expected_return.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 mb-0.5">Matures</p>
                        <p className="text-white">{new Date(inv.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleWithdraw(inv.id)}
                      disabled={withdrawing === inv.id}
                      className="w-full py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {withdrawing === inv.id ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">Invest for your Future</p>
        </div>
      </div>
    </section>
  )
}

export default Staking
