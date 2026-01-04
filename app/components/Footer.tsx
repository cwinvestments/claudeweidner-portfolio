import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">Claude Weidner</h3>
            <p className="text-gray-400 text-sm">
              Full-Stack Developer specializing in custom web applications,
              SaaS platforms, and payment integrations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-300 hover:text-white transition text-sm">Home</Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition text-sm">Services</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition text-sm">About</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition text-sm">Contact</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:cwaffiliateinvestments@gmail.com" className="text-gray-300 hover:text-white transition">
                cwaffiliateinvestments@gmail.com
              </a>
              <p className="text-gray-400">Appleton, Wisconsin</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Claude Weidner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
