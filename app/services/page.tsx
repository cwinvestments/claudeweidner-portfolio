import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Web Development Services | Claude Weidner',
  description: 'Custom web development services including landing pages, business websites, e-commerce, SaaS platforms, and web applications.',
};

export default function ServicesPage() {
  const projectPricing = [
    {
      name: 'Landing Pages & Simple Sites',
      price: '$500 - $1,000',
      features: [
        '1-5 pages',
        'Mobile responsive design',
        'Contact forms',
        'SEO basics',
        '1 round of revisions',
      ],
    },
    {
      name: 'Business Websites',
      price: '$1,500 - $3,000',
      features: [
        '5-10 pages',
        'Custom design',
        'Contact forms & lead capture',
        'Blog or news section',
        'Basic analytics',
        '2 rounds of revisions',
      ],
    },
    {
      name: 'E-Commerce Sites',
      price: '$3,000 - $8,000',
      features: [
        'Product catalog',
        'Shopping cart & checkout',
        'Payment processing',
        'Inventory management',
        'Order notifications',
        'Customer accounts',
      ],
    },
    {
      name: 'Full SaaS Platforms',
      price: '$5,000 - $15,000+',
      features: [
        'Custom web applications',
        'User authentication & portals',
        'Admin dashboards',
        'Database design',
        'API development',
        'Payment & subscription billing',
        'Email notifications',
      ],
      popular: true,
    },
    {
      name: 'Custom Web Applications',
      price: '$5,000 - $20,000+',
      features: [
        'Complex business logic',
        'Third-party integrations',
        'Custom features built to spec',
        'Scalable architecture',
      ],
    },
  ];

  const maintenancePlans = [
    {
      name: 'Starter',
      price: '$50',
      period: '/month',
      features: [
        'Hosting & domain management',
        'Security updates',
        'Uptime monitoring',
        '30 minutes of content updates',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      price: '$100',
      period: '/month',
      features: [
        'Everything in Starter',
        '2 hours of updates per month',
        'Monthly backups',
        'Performance monitoring',
        'Priority email support',
      ],
      popular: true,
    },
    {
      name: 'Business',
      price: '$200',
      period: '/month',
      features: [
        'Everything in Professional',
        '5 hours of updates per month',
        'Analytics reporting',
        'Same-day response time',
        'Phone support',
      ],
    },
    {
      name: 'Enterprise',
      price: '$400+',
      period: '/month',
      features: [
        'Unlimited updates',
        'Dedicated support',
        'Custom SLAs',
        'Strategic consulting',
        'Priority development queue',
      ],
    },
  ];

  const hourlyServices = [
    { service: 'Additional development', rate: '$75/hour' },
    { service: 'Consulting & strategy', rate: '$100/hour' },
    { service: 'Rush work (24-48hr)', rate: '$125/hour' },
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Discovery Call',
      description: 'Discuss project, goals, requirements',
    },
    {
      step: '2',
      title: 'Proposal & Quote',
      description: 'Detailed scope, timeline, pricing',
    },
    {
      step: '3',
      title: 'Development',
      description: 'Regular updates and check-ins',
    },
    {
      step: '4',
      title: 'Review & Launch',
      description: 'Final adjustments and go live',
    },
    {
      step: '5',
      title: 'Ongoing Support',
      description: 'Maintenance plans or as-needed updates',
    },
  ];

  const techStack = {
    'Frontend': ['React', 'Next.js', 'HTML/CSS', 'JavaScript', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Express'],
    'Database': ['PostgreSQL', 'Supabase'],
    'Hosting': ['Netlify', 'Railway', 'Vercel'],
    'Payments': ['Square', 'Stripe'],
    'Email': ['SendGrid'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Web Development Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Custom web solutions for businesses of all sizes
          </p>
        </div>
      </section>

      {/* Project Pricing */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Project Pricing</h2>
          <p className="text-gray-600 text-center mb-12">One-time development projects</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectPricing.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-xl p-6 ${
                  pkg.popular ? 'border-blue-600 shadow-lg' : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{pkg.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">{pkg.price}</p>
                <ul className="space-y-2">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Monthly Maintenance Plans</h2>
          <p className="text-gray-600 text-center mb-12">Keep your site running smoothly</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenancePlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-xl p-6 ${
                  plan.popular ? 'border-green-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{plan.name}</h3>
                <p className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hourly Services */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hourly Services</h2>

          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {hourlyServices.map((item, index) => (
                  <tr key={index} className={index !== hourlyServices.length - 1 ? 'border-b border-gray-200' : ''}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.service}</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-bold">{item.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>

          <div className="grid md:grid-cols-5 gap-4">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-6 text-gray-300 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tech Stack</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(techStack).map(([category, technologies]) => (
              <div key={category} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Contact me for a free consultation and project quote.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
