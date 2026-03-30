
export const SocialIcon = ({ icon: Icon }: { icon: React.ReactNode }) => (
    <a 
        href="#" 
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition-all border border-gray-100"
    >
        {Icon}
    </a>
)