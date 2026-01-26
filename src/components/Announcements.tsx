interface Announcement {
  image: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
}

const Announcements = () => {
  const announcements: Announcement[] = [
    {
      image: 'schwarzschild',
      badge: 'Announcement',
      badgeColor: 'bg-green-500',
      title: 'Since Jan 1st 2025, Sandclock deposits are insured!',
      description: 'All Sandclock deposits are insured to bring an extra layer of security and credibility to our products.',
    },
    {
      image: 'security-alliance',
      badge: 'Announcement',
      badgeColor: 'bg-green-500',
      title: 'Sandclock is part of the Security Alliance White Hat Safe Harbor Agreement',
      description: "We're proud to be part of the SEAL White Hat Safe Harbor registry alongside Polymarket, SiloFinance, OriginProtocol and more!",
    },
    {
      image: 'soc2',
      badge: 'Security',
      badgeColor: 'bg-gray-600',
      title: 'Audited, Secure and SOC2 Compliant',
      description: 'You can find our audit reports and SOC2 attestation report in our "Docs".',
    },
  ];

  return (
    <section className="px-8 lg:px-16 py-16 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl lg:text-4xl font-bold text-center mb-12">
          Recent Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
            <div
              key={announcement.title}
              className="bg-transparent rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="h-48 lg:h-56 relative rounded-2xl overflow-hidden mb-5">
                {announcement.image === 'schwarzschild' && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">Insured by</p>
                      <p className="text-white text-2xl font-bold flex items-center gap-3">
                        <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-lg font-bold">S</span>
                        Schwarzschild
                      </p>
                    </div>
                  </div>
                )}
                {announcement.image === 'security-alliance' && (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
                      </svg>
                      <p className="text-white text-lg font-semibold">Security</p>
                      <p className="text-white text-lg font-semibold">Alliance</p>
                    </div>
                  </div>
                )}
                {announcement.image === 'soc2' && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 flex items-center justify-center">
                    <div className="bg-white rounded-full p-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 font-semibold">AICPA</p>
                        <p className="text-2xl font-bold text-blue-600">SOC</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <span className={`${announcement.badgeColor} text-white text-sm px-4 py-1.5 rounded-lg font-medium`}>
                  {announcement.badge}
                </span>
                <h3 className="text-white font-semibold text-lg lg:text-xl mt-4 mb-3">{announcement.title}</h3>
                <p className="text-gray-400 text-base">{announcement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
