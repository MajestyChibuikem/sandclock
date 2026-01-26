const Stats = () => {
  const stats = [
    { label: 'TVL', value: '$66.0K' },
    { label: 'Total stETH Exposure', value: '$65.7K' },
  ];

  return (
    <section className="px-8 lg:px-16 py-12 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-black rounded-3xl p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-around gap-8">
          {/* Animated border container */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            {/* Base border */}
            <div className="absolute inset-0 rounded-3xl border border-white/10" />

            {/* Traveling glow dot */}
            <div className="absolute w-4 h-4 rounded-full bg-green-500 blur-[2px] animate-travel-dot">
              <div className="absolute inset-0 rounded-full bg-green-400 blur-sm" />
              <div className="absolute -inset-1 rounded-full bg-green-500/50 blur-md" />
              <div className="absolute -inset-2 rounded-full bg-green-500/30 blur-lg" />
            </div>

            {/* Trail effect - multiple dots with delay */}
            <div className="absolute w-3 h-3 rounded-full bg-green-500/60 blur-[3px] animate-travel-dot" style={{ animationDelay: '-0.1s' }} />
            <div className="absolute w-2 h-2 rounded-full bg-green-500/40 blur-[4px] animate-travel-dot" style={{ animationDelay: '-0.2s' }} />
            <div className="absolute w-2 h-2 rounded-full bg-green-500/20 blur-[5px] animate-travel-dot" style={{ animationDelay: '-0.3s' }} />
          </div>

          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center relative z-10">
              <p className="text-gray-400 text-base lg:text-lg mb-2">{stat.label}</p>
              <p className="text-white text-3xl lg:text-4xl font-bold">{stat.value}</p>
              {index < stats.length - 1 && (
                <div className="hidden sm:block absolute right-1/2 top-1/2 w-px h-12 bg-gray-700 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes travel-dot {
          0%, 100% {
            top: -2px;
            left: 48px;
          }
          20% {
            top: -2px;
            left: calc(100% - 48px);
          }
          25% {
            top: -2px;
            left: calc(100% - 2px);
          }
          45% {
            top: calc(100% - 2px);
            left: calc(100% - 2px);
          }
          50% {
            top: calc(100% - 2px);
            left: calc(100% - 48px);
          }
          70% {
            top: calc(100% - 2px);
            left: 48px;
          }
          75% {
            top: calc(100% - 2px);
            left: -2px;
          }
          95% {
            top: -2px;
            left: -2px;
          }
        }

        .animate-travel-dot {
          animation: travel-dot 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Stats;
