import { RotateCcw } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function AuthLayout({children}:{children:React.ReactNode}){
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <RotateCcw className="size-4" />
            </div>
            Recode
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="bg-white relative hidden lg:flex lg:items-center lg:justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          {/* <source src="/auth-video.webm" type="video/webm" />
          Your browser does not support the video tag. */}
        </video>
        <div className="relative z-10 flex items-center justify-center">
          <div className="rounded-lg p-8 text-center">
            <h2 className="text-white text-5xl font-bold mb-4 font-KeplerStd select-none">Recode</h2>
          </div>
        </div>
      </div>
    </div>
    )
}