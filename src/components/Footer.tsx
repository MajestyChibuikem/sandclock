const Footer = () => {
  const legalLinks = [
    { name: 'Terms and Conditions', href: 'https://www.sandclock.org/terms-and-conditions' },
    { name: 'General Terms', href: 'https://www.sandclock.org/general-terms' },
    { name: 'Privacy Policy', href: 'https://www.sandclock.org/privacy-policy' },
    { name: 'Cookie Policy', href: 'https://www.sandclock.org/cookie-policy' },
    { name: 'Articles', href: 'https://medium.com/sandclock' },
    { name: 'Docs', href: 'https://docs.sandclock.org/current' },
  ];

  const socialLinks = [
    { name: 'X/Twitter', href: 'https://x.com/sandclockorg' },
    { name: 'Medium', href: 'https://medium.com/@sandclockorg' },
    { name: 'Discord', href: 'https://discord.gg/sandclock-809428421670207549' },
    { name: 'Github', href: 'https://github.com/lindy-labs' },
  ];

  return (
    <footer className="px-8 lg:px-16 py-16 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <a href="/" className="flex items-center gap-2 text-white font-semibold text-xl mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z" fill="white"/>
                <path d="M12 6L8 8V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V8L12 6Z" fill="black"/>
              </svg>
              Sandclock
            </a>
            <p className="text-gray-500 text-base mt-10">&copy; Sandclock 2026</p>
          </div>

          <div>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 text-base hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 text-base hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
