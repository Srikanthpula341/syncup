import { cn } from "@/app/lib/utils";
import Image from "next/image";

export const FeatureCard = ({ icon, title, description, color }: { icon: string, title: string, description: string, color: string }) => (
  <div className="flex flex-col items-center text-center p-6 transition-transform hover:scale-105">
    <div className={cn("w-32 h-32 rounded-3xl mb-6 relative overflow-hidden shadow-xl", color)}>
      <Image 
        src={icon} 
        alt={title} 
        fill 
        sizes="128px"
        className="object-cover p-4"
      />
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-[150px]">{description}</p>
  </div>
)
