'use client';
import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth()

  return (
    <aside
      className='custom-scrollbar 
      sticky
      left-0
      top-0
      z-20
      flex
      h-screen
      w-fit
      flex-col
      justify-between
      overflow-auto
      border-r
      border-r-dark-4
      bg-dark-2 
      pb-5 
      pt-24 
      max-md:hidden'
    >
      <div className='flex w-full flex-1 flex-col gap-4 px-6'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if(link.route === '/profile') link.route = `${link.route}/${userId}`
          return (
            <Link
              className={`relative flex justify-start gap-4 rounded-lg p-4
                ${isActive && 'bg-primary-500'}
              `}
              href={link.route}
              key={link.route}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src='/images/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />
              <div className='text-light-1 max-lg:hidden'>Logout</div>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </aside>
  );
};

export default LeftSidebar;
