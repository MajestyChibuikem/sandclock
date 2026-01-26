import { useState } from 'react'
import logoIcon from '../images/image.png'

const Staking = () => {
  const [activeTab, setActiveTab] = useState('Stake')
  const [stakeAmount, setStakeAmount] = useState('')

  const tabs = ['Stake', 'Unstake', 'Compound', 'Claim']

  const stats = [
    { label: 'TVL', value: '50.6K' },
    { label: 'Chain', value: 'Ethereum' },
    { label: 'Lockup', value: '0 days' },
    { label: 'Multiplier Points', value: '0.0000' },
    { label: 'Reward Token', value: 'wETH' },
    { label: 'Address', value: '0x0A...55D8', copyable: true },
  ]

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
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-3px);
                  }
                }
                .bounce-dot {
                  animation: subtle-bounce 1.2s ease-in-out infinite;
                }
              `}</style>
              <div className="grid grid-cols-[repeat(40,1fr)] gap-1">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < 160 ? 'bg-green-500 bounce-dot' : 'bg-gray-700'
                    }`}
                    style={{
                      animationDelay: `${(i % 8) * 0.15}s`
                    }}
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

          {/* Right side - Staking Form */}
          <div className="bg-black border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs sm:text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-white border-green-500'
                      : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Stake Token Input */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Stake token</span>
                <span className="text-gray-400 text-sm">Balance: 0.00 QUARTZ</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-green-500 text-sm font-medium hover:text-green-400">
                  Max
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-black border border-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoIcon} alt="QUARTZ" className="w-5 h-5 object-contain" />
                  <span className="text-white font-medium">QUARTZ</span>
                </div>
                <div className="text-right">
                  <input
                    type="text"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-white text-xl font-semibold text-right w-24 outline-none"
                  />
                  <p className="text-gray-500 text-sm">~$0.0000</p>
                </div>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors mb-6">
              Connect Wallet
            </button>

            {/* You'll receive */}
            <div className="flex justify-between items-center mb-4 py-3 border-t border-gray-800">
              <span className="text-gray-400 text-sm">You'll receive:</span>
              <span className="text-white font-medium">0.000 sQUARTZ</span>
            </div>

            {/* Lockup Period Progress */}
            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Lockup Period Progress</span>
                <span className="text-white text-sm font-medium">30/30 days</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-full h-full bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-500 text-xs mt-2">Your funds will be fully unlocked in 0 days.</p>
            </div>
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
