import Image from "next/image";

export default function Header({ title }) {
  return (
    <header className="w-full py-6 px-6 bg-gradient-to-r from-black/40 to-black/10 border-b border-white/5">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <div>
          <Image
            src="/logo.jpeg"      // public folder me aapka logo
            alt="Chimney Solutions"
            width={80}          // 12*4 = 48px
            height={80}
            className="object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-white">
          Product service Health Report
        </h1>
      </div>
    </header>
  )
}
