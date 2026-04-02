import { LogoFull } from "@/components/Logo";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center p-6 sm:items-center md:p-8 ">
      <div className="flex flex-col gap-8 sm:w-120 md:gap-16">
        <div className="flex justify-center">
          <LogoFull />
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
