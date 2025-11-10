import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image'

export default function Page() {
  return (
    <main className="flex-grow flex flex-col">
      <div className="flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-indigo-100 via-white to-indigo-50 opacity-70"></div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome to <span className="text-indigo-600">NextVision</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            NextVision empowers developers and creators to build modern, high-performance websites with ease.
            Explore our tools, learn cutting-edge web technologies, and take your projects to the next level.
          </p>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Lightning-fast builds powered by Next.js
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Seamless deployment on Vercel
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Optimized for SEO and accessibility
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <a
              href="/about"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium transition-colors hover:bg-indigo-500"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <a
              href="/blog"
              className="flex items-center gap-2 rounded-lg border border-indigo-600 px-5 py-3 text-indigo-600 font-medium transition-colors hover:bg-indigo-50"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
