import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="shadow-md bg-white">
        <div className="container mx-auto py-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={32}
                height={32}
                priority
              />
              <h1 className="text-lg font-semibold mr-4">مدیریت وظایف من</h1>
            </div>
            <div className="flex items-center">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={32}
                height={32}
                priority
              />
              <span className="mr-2">خوش آمدید!</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}