import Image from 'next/image';
import Link from 'next/link';
import React, { memo } from 'react';

const Header = memo(function Header() {
  return (
    <header role="banner" aria-label="هدر اصلی اپلیکیشن">
      <div className="shadow-md bg-white">
        <div className="container mx-auto py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="لوگوی اپلیکیشن مدیریت وظایف"
                width={32}
                height={32}
                priority
                sizes="32px"
                className="object-contain"
              />
              <h1 className="text-lg font-semibold mr-4">مدیریت وظایف من</h1>
            </div>
            <div className="flex items-center space-x-4" role="complementary" aria-label="منوی کاربر">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                ورود
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                ثبت نام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
