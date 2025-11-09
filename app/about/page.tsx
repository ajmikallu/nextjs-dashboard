export default function AboutPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center bg-gray-50 px-6 py-16 md:px-20">
      <section className="max-w-4xl text-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About <span className="text-indigo-600">NextVision</span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          NextVision is a learning and development initiative focused on helping developers
          master <strong>Next.js</strong>, <strong>SEO optimization</strong>, and <strong>modern web technologies</strong>.
          Our mission is to provide clean, scalable templates and hands-on examples that simplify the learning
          experience while following industry best practices.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="rounded-xl bg-white shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Our Vision</h3>
            <p className="text-gray-600">
              Empower every developer to create lightning-fast, SEO-ready websites without friction.
            </p>
          </div>

          <div className="rounded-xl bg-white shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Our Approach</h3>
            <p className="text-gray-600">
              We combine real-world examples, structured learning, and simple, reusable code to help you grow
              from beginner to pro.
            </p>
          </div>

          <div className="rounded-xl bg-white shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Our Tools</h3>
            <p className="text-gray-600">
              Built with <strong>Next.js App Router</strong>, <strong>Tailwind CSS</strong>, and <strong>Vercel</strong> —
              everything you need to build, deploy, and optimize your next big idea.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium transition-colors hover:bg-indigo-500"
          >
            Explore the Blog
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
