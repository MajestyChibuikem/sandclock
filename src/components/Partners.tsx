import aaveLogo from '../images/Company=Aave_DarkMode.svg'
import lidoLogo from '../images/Company=Lido_DarkMode.svg'
import compoundLogo from '../images/Company=Compound_DarkMode.svg'
import morphoLogo from '../images/Company=Morpho_DarkMode.svg'

const Partners = () => {
  const partners = [
    { name: 'AAVE', logo: aaveLogo },
    { name: 'LIDO', logo: lidoLogo },
    { name: 'Compound', logo: compoundLogo },
    { name: 'Morpho', logo: morphoLogo },
  ];

  return (
    <section className="px-8 lg:px-16 py-16 bg-black border-b border-white/10">
      <div className="w-full flex flex-wrap items-center justify-between gap-12">
        {partners.map((partner) => (
          <img
            key={partner.name}
            src={partner.logo}
            alt={partner.name}
            className="h-12 lg:h-16 xl:h-20 object-contain"
          />
        ))}
      </div>
    </section>
  );
};

export default Partners;
