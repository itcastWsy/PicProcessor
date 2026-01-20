import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface QrCodePreviewProps {
  src: string
  alt: string
  label: string
}

export function QrCodePreview({ src, alt, label }: QrCodePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Use effect to handle mounting/unmounting delay if we wanted to strictly remove from DOM,
  // but for pure CSS transition, keeping it in DOM is easier. 
  // However, keeping large images in DOM might be heavy? 
  // No, 2 images is fine. 
  // Let's use simple CSS class toggle.

  return (
    <div 
      className="flex flex-col items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       <div className="relative w-full aspect-square bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 p-1 cursor-zoom-in transition-transform duration-300 hover:scale-105">
         <img 
           src={src} 
           alt={alt}
           className="w-full h-full object-contain"
         />
       </div>
       <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
       
       {/* Preview Modal - Always rendered but toggled via opacity/visibility */}
       <div 
         className={cn(
           "fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-500 ease-in-out",
           isHovered ? "opacity-100 visible" : "opacity-0 invisible"
         )}
       >
         {/* Backdrop */}
         <div className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity duration-500" />
         
         {/* Content */}
         <div 
           className={cn(
             "relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
             isHovered ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
           )}
         >
           <img 
             src={src} 
             alt={alt}
             className="w-[50vh] h-[50vh] object-contain max-w-[90vw] max-h-[90vh]"
           />
           <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{label}</div>
         </div>
       </div>
    </div>
  )
}
