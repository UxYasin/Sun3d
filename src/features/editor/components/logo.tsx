import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group select-none">
      <span className="text-xl font-black tracking-tight text-neutral-950 font-serif italic">
        Sun<span className="text-[#8b3dff] not-italic font-sans">3D</span>
      </span>
      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full hidden sm:inline">
        Canvas
      </span>
    </Link>
  );
};
