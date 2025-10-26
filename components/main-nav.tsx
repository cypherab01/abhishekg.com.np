import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { Icons } from './icons';

export function MainNav() {
  return (
    <div className="hidden mr-4 md:flex">
      <Link href="/" className="flex items-center gap-2 mr-4 lg:mr-6">
        <Icons.logo />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link href="/">Home</Link>

        <Link
          href={siteConfig.links.resume}
          target="_blank"
          className={cn('flex gap-1')}
        >
          Resume <ExternalLink className="size-3" />
        </Link>
      </nav>
    </div>
  );
}
