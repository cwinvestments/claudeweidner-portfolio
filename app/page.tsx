import ContactForm from './components/ContactForm';

export default function Home() {
  const projects = [
    {
      name: "SnowTrack™",
      url: "https://snowtrack.pro",
      status: "LIVE",
      statusColor: "bg-green-500",
      version: "v2.7.0",
      tagline: "Snow removal business management SaaS",
      description: "Comprehensive SaaS platform for snow removal businesses - customer management, route optimization, real-time billing, and financial reporting.",
      techStack: ["React 18", "Node.js", "PostgreSQL", "Square API", "Google Maps", "NWS Weather", "SendGrid"],
      features: [
        "Storm Mode - mobile-first route servicing",
        "Bill All - automated Square invoicing",
        "Tiered SaaS pricing ($10-99/mo)",
        "Super Admin multi-tenant management"
      ],
      accentColor: "border-[#2196F3]",
      buttonColor: "bg-[#2196F3] hover:bg-[#1976D2]"
    },
    {
      name: "DeedStack™",
      url: "https://deedstack.com",
      status: "LIVE",
      statusColor: "bg-green-500",
      tagline: "White-label SaaS platform for land financing companies",
      description: "Comprehensive business management platform for land investors offering seller financing. Transforms manual spreadsheet processes into a streamlined, professional white-label system.",
      techStack: ["React.js", "Node.js", "PostgreSQL (Supabase)", "Square API", "SendGrid", "Cloudinary"],
      features: [
        "Multi-tenant with branded subdomains",
        "Customer portal with payment processing",
        "Loan management with amortization",
        "Automated billing with late fees"
      ],
      accentColor: "border-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Soul Siren Somatics™",
      url: null,
      status: "IN DEVELOPMENT",
      statusColor: "bg-[#8B5CF6]",
      tagline: "Wellness business platform for somatic healing practice",
      description: "Comprehensive wellness business platform offering 1:1 support sessions, energetic scans, and membership community called \"The Sanctuary.\"",
      techStack: ["React.js", "Node.js", "PostgreSQL (Supabase)", "Square API", "SendGrid", "JWT Auth"],
      features: [
        "Energetic scan tracking with PDF export",
        "Membership tiers (Free, $27/mo, $97/mo)",
        "Glassmorphism mobile-responsive design",
        "Interactive timeline charts"
      ],
      accentColor: "border-[#8B5CF6]",
      buttonColor: "bg-[#8B5CF6] hover:bg-[#7C3AED]"
    },
    {
      name: "Green Acres Land Investments",
      url: "https://greenacreslandinvestments.com",
      status: "LIVE",
      statusColor: "bg-green-500",
      tagline: "Land financing platform",
      description: "Complete land financing platform enabling customers to purchase raw land with flexible owner financing options.",
      techStack: ["React 18", "Node.js", "Express", "PostgreSQL (Supabase)", "Square API", "JWT Auth", "reCAPTCHA v3"],
      features: [
        "Real payment processing with Square",
        "Interactive financing calculator",
        "Customer dashboard with loan tracking",
        "Mobile-responsive design"
      ],
      accentColor: "border-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      name: "Break The Chains™ Ecosystem",
      url: "https://breakthechains.life",
      status: "LIVE",
      statusColor: "bg-green-500",
      tagline: "Chronic illness nutrition ecosystem",
      description: "Comprehensive chronic illness nutrition ecosystem with 364+ tested recipes, educational courses, and spoon theory integration.",
      techStack: ["React", "Netlify", "WCAG 2.1 AA"],
      features: [
        "364+ recipes with spoon theory ratings",
        "110+ educational videos (26+ hours)",
        "4 comprehensive 8-week courses",
        "Screen reader & keyboard navigation"
      ],
      accentColor: "border-orange-500",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    },
    {
      name: "MedTracker & Vault",
      url: "https://medtracker.claudeweidner.com",
      secondaryUrl: "https://vault.claudeweidner.com",
      status: "LIVE",
      statusColor: "bg-green-500",
      tagline: "Chronic illness management tools",
      description: "Medication tracking with spoon theory integration and secure password management.",
      techStack: ["PWA", "React", "Encryption", "Offline-First"],
      features: [
        "Medication scheduling & tracking",
        "Military-grade password encryption",
        "Offline functionality (PWA)",
        "One-tap emergency access"
      ],
      accentColor: "border-teal-500",
      buttonColor: "bg-teal-500 hover:bg-teal-600"
    }
  ];

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
              <p className="text-gray-800 font-medium">SaaS & Multi-Tenant Systems</p>
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
              <p className="text-gray-800 font-medium">RESTful API Development</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-gray-700">
            <div>
              <span className="text-3xl font-bold text-blue-600">12+</span>
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

      {/* Featured Projects */}
      <section id="portfolio" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Featured Projects
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Showcasing real production applications with proven results
          </p>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-gray-50 to-white border-2 ${project.accentColor} rounded-xl p-6 shadow-lg`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {project.name}
                  </h3>
                  <span className={`${project.statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {project.status}
                    {project.version && ` ${project.version}`}
                  </span>
                </div>

                <p className="text-sm text-gray-500 italic mb-2">{project.tagline}</p>

                <p className="text-gray-700 mb-4 text-sm">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key Features */}
                <div className="space-y-2 mb-4">
                  {project.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <p className="text-gray-700 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>

                {/* Live Link */}
                {project.url ? (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block ${project.buttonColor} text-white px-4 py-2 rounded-lg font-semibold transition text-sm`}
                    >
                      View Live Site →
                    </a>
                    {project.secondaryUrl && (
                      <a
                        href={project.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block ${project.buttonColor} text-white px-4 py-2 rounded-lg font-semibold transition text-sm`}
                      >
                        View Vault →
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="inline-block bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-semibold text-sm">
                    Launching Q1 2025
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-700 mb-8 text-center">
            Ready to build your project? Tell me about your vision.
          </p>
          <ContactForm />
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
