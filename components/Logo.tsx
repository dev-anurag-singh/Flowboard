export function LogoFull() {
  return (
    <div className="inline-flex items-center gap-4">
      <LogoSmall />
      <span className="text-[20px] font-bold tracking-tight text-[#000112] dark:text-foreground">
        Flowboard
      </span>
    </div>
  );
}

export function LogoSmall() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <rect width="6" height="25" rx="2" fill="#635FC7" />
      <rect opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7" />
      <rect opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7" />
    </svg>
  );
}

export function LogoLarge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <rect width="25" height="100" rx="2" fill="#635FC7" />
      <rect
        opacity="0.75"
        x="37.5"
        width="25"
        height="100"
        rx="2"
        fill="#635FC7"
      />
      <rect
        opacity="0.5"
        x="75"
        width="25"
        height="100"
        rx="2"
        fill="#635FC7"
      />
    </svg>
  );
}
