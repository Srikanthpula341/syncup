import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <Link href="/" className="text-2xl font-bold tracking-tight text-[#FF6B35]">SYNCUP</Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
        <Link href="/why-us" className="hover:text-[#FF6B35] transition-colors">Why us?</Link>
        <Link href="/features" className="hover:text-[#FF6B35] transition-colors">Features</Link>
        <Link href="/syncup-web" className="hover:text-[#FF6B35] transition-colors">SyncUp web</Link>
      </div>

      <Link 
        href="/auth" 
        className="bg-[#FF6B35] text-white px-8 py-2.5 rounded-full font-semibold hover:bg-[#e85a2a] transition-all shadow-lg shadow-orange-200"
      >
        Login
      </Link>
    </nav>
  )
}