import { Link } from 'react-router-dom'
import logoIcon from '../images/image.png'

const Hero = () => {
  return (
    <section className="px-8 lg:px-16 py-20 lg:py-28 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-2xl">
          Finance app for modern money.
        </h1>
        <div className="flex flex-col gap-6 max-w-xl">
          <p className="text-gray-400 text-xl lg:text-2xl">
            Put your capital to work through curated vaults that earn yield without middlemen or complexity.
          </p>
          <div className="flex gap-4">
            <Link
              to="/earn"
              className="px-8 py-4 bg-green-500 text-black font-semibold text-lg rounded-xl hover:bg-green-400 transition-colors text-center"
            >
              Start Earning
            </Link>
            <Link
              to="/earn"
              className="px-8 py-4 bg-gray-800 text-white font-semibold text-lg rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <img src={logoIcon} alt="QUARTZ" className="w-6 h-6 object-contain" />
              Buy QUARTZ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
