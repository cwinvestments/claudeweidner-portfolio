export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Claude Weidner
          </h1>
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-6">
            Full-Stack Developer
          </p>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Building Custom Web Applications That Solve Real Problems
          </p>

          {/* Specializations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">Payment Integration (Square, Stripe)</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">Health & Wellness Applications</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">E-commerce & Financing Platforms</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">Secure User Authentication</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">Database Architecture</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 font-medium">RESTful API Development</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-gray-700">
            <div>
              <span className="text-3xl font-bold text-blue-600">8+</span>
              <p className="text-sm">Production Projects</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-green-500">5+</span>
              <p className="text-sm">Years Experience</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-blue-600">100%</span>
              <p className="text-sm">Client Satisfaction</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#portfolio" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Portfolio
            </a>
            <a 
              href="#contact" 
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section id="portfolio" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Featured Project
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Showcasing real production applications with proven results
          </p>

          {/* Green Acres Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-blue-600 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Green Acres Land Investments
              </h3>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                LIVE
              </span>
            </div>
            
            <p className="text-xl text-gray-700 mb-6">
              Complete land financing platform enabling customers to purchase raw land with flexible owner financing options
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">React 18</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">PostgreSQL</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Express</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Square API</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">JWT Auth</span>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">User registration & authentication</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">Real payment processing with Square</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">Interactive financing calculator</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">Customer dashboard with loan tracking</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">Mobile-responsive design</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p className="text-gray-700">Google reCAPTCHA v3 security</p>
              </div>
            </div>

            {/* Live Link */}
            <a 
              href="https://greenacreslandinvestments.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Live Site →
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Ready to build your project? Let's discuss how I can bring your vision to life.
          </p>
          <a 
            href="mailto:claude@claudeweidner.com" 
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition text-lg"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Claude Weidner. Full-Stack Developer | Appleton, Wisconsin
          </p>
        </div>
      </footer>
    </main>
  );
}