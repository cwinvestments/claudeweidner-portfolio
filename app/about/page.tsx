import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About | Claude Weidner',
  description: 'Full-Stack Developer based in Appleton, Wisconsin. Building custom web applications, SaaS platforms, and payment integrations.',
};

export default function AboutPage() {
  const skills = {
    'Frontend': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    'Backend': ['Node.js', 'Express', 'REST APIs', 'Authentication'],
    'Database': ['PostgreSQL', 'Supabase', 'SQL'],
    'Tools & Platforms': ['Git', 'Netlify', 'Railway', 'Vercel'],
    'Integrations': ['Stripe', 'Square', 'SendGrid', 'Twilio'],
  };

  const beliefs = [
    {
      title: 'Build for the User',
      description: 'Every feature should solve a real problem. I focus on creating intuitive experiences that users actually want to use.',
    },
    {
      title: 'Keep It Simple',
      description: 'The best solutions are often the simplest. I avoid over-engineering and unnecessary complexity.',
    },
    {
      title: 'Own the Outcome',
      description: 'I take responsibility for the entire project lifecycle, from planning through launch and beyond.',
    },
    {
      title: 'Communicate Clearly',
      description: 'Regular updates, honest timelines, and straightforward explanations. No technical jargon unless needed.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Photo Placeholder */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-24 h-24 md:w-32 md:h-32 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Claude Weidner
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-2">
              Full-Stack Developer
            </p>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Appleton, Wisconsin
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              I&apos;m a full-stack developer specializing in building custom web applications
              and SaaS platforms. I work with businesses to turn their ideas into
              functional, user-friendly software.
            </p>
            <p>
              My focus is on creating complete solutions — from database design and API
              development to polished frontends and payment integrations. I handle the
              entire technical stack so you can focus on running your business.
            </p>
            <p>
              Whether you need a simple landing page, a complex web application, or
              something in between, I approach every project with the same goal:
              build something that works well and solves real problems.
            </p>
          </div>
        </div>
      </section>

      {/* What I Believe */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What I Believe</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {beliefs.map((belief, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{belief.title}</h3>
                <p className="text-gray-600">{belief.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
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
          <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
          <p className="text-blue-100 text-lg mb-8">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
