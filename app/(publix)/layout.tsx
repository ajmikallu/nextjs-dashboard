import NavLinks from '@/app/ui/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
import {
    ArrowRightIcon,
} from '@heroicons/react/24/outline';



export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <div className="flex px-3 py-4 md:px-2 gap-4 bg-blue-500">
                <AcmeLogo />
                <div className="flex-grow flex items-center">
                <NavLinks />
                </div>

                <Link
                    href="/login"
                    className="flex items-center gap-3 self-start rounded-lg bg-blue-500 md:px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                    <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
                </Link>
            </div>
            <div className="flex-grow flex md:p-12">{children}</div>
        </div>
    );
}