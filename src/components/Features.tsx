import soc2Icon from '../images/SOC2.png'
import insuredIcon from '../images/insured.svg'

const Features = () => {
  return (
    <section className="px-8 lg:px-16 py-16 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              <span className="text-green-500">Risk management is key.</span>{' '}
              <span className="text-white">
                Your capital's safety and diversification overseen and constantly assessed
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="bg-black border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 min-w-[140px]">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-gray-400 text-sm text-center">Safe data</span>
            </div>
            <div className="bg-black border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 min-w-[140px]">
              <img src={soc2Icon} alt="SOC2" className="w-8 h-8 object-contain" />
              <span className="text-gray-400 text-sm text-center">SOC2 Compliant</span>
            </div>
            <div className="bg-black border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 min-w-[140px]">
              <img src={insuredIcon} alt="Insured" className="w-8 h-8 object-contain" />
              <span className="text-gray-400 text-sm text-center">Insured by Schwarzschild</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
