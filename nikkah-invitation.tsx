"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

// Animations are now defined in globals.css

// Decorative floral corner component
const FloralCorner = ({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const rotations = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90"
  }
  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0"
  }
  
  return (
    <div className={`absolute ${positions[position]} w-32 h-32 ${rotations[position]} opacity-60 pointer-events-none`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="floralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a5a5" />
            <stop offset="100%" stopColor="#a47060" />
          </linearGradient>
        </defs>
        {/* Decorative swirl */}
        <path d="M5,50 Q25,20 50,25 Q75,30 70,55 Q65,80 40,75 Q15,70 20,45" 
              fill="none" stroke="url(#floralGrad)" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="15" cy="35" r="4" fill="#d4a5a5" opacity="0.5"/>
        <circle cx="25" cy="20" r="3" fill="#a47060" opacity="0.4"/>
        <circle cx="40" cy="15" r="2" fill="#9b6b5c" opacity="0.5"/>
      </svg>
    </div>
  )
}

// Bottom floral arrangement
const FloralArrangement = () => (
  <div className="w-full flex justify-center mt-8">
    <img 
      src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80" 
      alt="Floral decoration"
      className="w-full max-w-md h-40 object-cover object-top opacity-90 rounded-t-full"
      style={{ 
        maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)"
      }}
      crossOrigin="anonymous"
    />
  </div>
)

export default function Component() {
  const [currentPage, setCurrentPage] = useState("cover")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const targetDate = new Date("2026-04-03T16:30:00").getTime()
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSaveTheDate = () => {
    const eventDetails = {
      title: "Nikkah Ceremony - Syed Usman Hussain & Shafaq Amin",
      start: "20260403T163000",
      end: "20260403T193000",
      description: "Join us for the Nikkah Ceremony of Syed Usman Hussain and Shafaq Amin.",
      location: "Quran Academy Yaseenabad branch",
    }
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`
    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.start}&enddt=${eventDetails.end}&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Nikkah Invitation//EN\nBEGIN:VEVENT\nUID:nikkah-${Date.now()}@invitation.com\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\nDTSTART:${eventDetails.start}Z\nDTEND:${eventDetails.end}Z\nSUMMARY:${eventDetails.title}\nDESCRIPTION:${eventDetails.description}\nLOCATION:${eventDetails.location}\nEND:VEVENT\nEND:VCALENDAR`

    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      const blob = new Blob([icsContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "nikkah-ceremony.ics"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else if (userAgent.includes("android")) {
      window.open(googleCalendarUrl, "_blank")
    } else {
      const choice = confirm("Choose your calendar:\nOK for Google Calendar\nCancel for Outlook Calendar")
      if (choice) window.open(googleCalendarUrl, "_blank")
      else window.open(outlookCalendarUrl, "_blank")
    }
  }

  const handleLocationClick = () => {
    window.open("https://maps.app.goo.gl/KeQ4oc18Y9uwfXTr5?g_st=aw", "_blank")
  }

  const handleRSVPClick = () => {
    const phoneNumber = "923118335838"
    const message = encodeURIComponent("Assalamualaikum! I would like to confirm my attendance for the Nikkah ceremony of Syed Usman Hussain & Shafaq Amin on 3rd April 2026.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handleOpenInvitation = async () => {
    setCurrentPage("loading")
    setLoadingProgress(0)

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 2

        if (newProgress >= 50 && prev < 50) {
          ;(async () => {
            try {
              const audioSrc = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0627%282%29-fHKFYsFQhHNnJVWGHooruickURw9h3.MP3"
              const audio = new Audio()
              audio.crossOrigin = "anonymous"
              audio.loop = true
              audio.volume = 0.7
              audio.preload = "auto"
              audioRef.current = audio
              audio.src = audioSrc

              await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("Audio loading timeout")), 10000)
                audio.addEventListener("canplaythrough", () => { clearTimeout(timeout); resolve(true) }, { once: true })
                audio.addEventListener("error", () => { clearTimeout(timeout); reject(new Error("Audio loading failed")) }, { once: true })
                audio.load()
              })

              const playPromise = audio.play()
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  const playOnInteraction = () => {
                    audio.play().then(() => {
                      document.removeEventListener("click", playOnInteraction)
                      document.removeEventListener("touchstart", playOnInteraction)
                    }).catch(() => {})
                  }
                  document.addEventListener("click", playOnInteraction, { once: true })
                  document.addEventListener("touchstart", playOnInteraction, { once: true })
                })
              }
            } catch (error) {
              console.error("Audio setup failed:", error)
            }
          })()
        }

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setCurrentPage("invitation"), 500)
          return 100
        }
        return newProgress
      })
    }, 60)
  }

  // ─── Cover Page ───────────────────────────────────────────────────────────────
  if (currentPage === "cover") {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        
        
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pink%20White%20Elegant%20Watercolor%20International%20Women%27s%20Day%208%20March%20Greeting%20VIdeo-9zCZ1DWn8iwdBukTsumQpBlKjkW7sz.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-white/20" />

        <div style={{ display: "none" }}>
          <audio ref={audioRef} preload="auto" />
        </div>

        <div className="text-center space-y-10 max-w-md mx-auto relative z-10">
          <div className="space-y-2 fade-in-up delay-100">
            <p 
              className="text-[#5a4a42] text-lg tracking-widest uppercase drop-shadow-sm"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The Nikkah Of
            </p>
          </div>

          {/* Names in elegant script */}
          <div className="space-y-4">
            <h1
              className="text-6xl md:text-7xl text-[#4a3a32] font-normal leading-tight drop-shadow-sm fade-in-up delay-200"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Usman
            </h1>
            <p 
              className="text-3xl text-[#5a4a42] drop-shadow-sm fade-in-scale delay-300"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              &
            </p>
            <h1
              className="text-6xl md:text-7xl text-[#4a3a32] font-normal leading-tight drop-shadow-sm fade-in-up delay-400"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Shafaq
            </h1>
          </div>

          {/* Arabic blessing */}
          <div
            className="text-2xl text-[#5a4a42] font-normal tracking-wider drop-shadow-sm fade-in-up delay-500"
            style={{ fontFamily: "Amiri, serif" }}
          >
            ٱلْـحَـمْدُ لِلّٰهِ
          </div>

          <div className="pt-4 fade-in-scale delay-600">
            <Button
              onClick={handleOpenInvitation}
              className="bg-[#6b5548] hover:bg-[#5a4a42] text-white rounded-full px-12 py-4 text-base font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 tracking-wider gentle-bounce"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Open Invitation
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Loading Page ─────────────────────────────────────────────────────────────
  if (currentPage === "loading") {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        
        
        {/* Watercolor background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at top, #f0e6d8 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, #d4a5a5 0%, transparent 40%),
              radial-gradient(ellipse at bottom left, #e8dcc8 0%, transparent 40%),
              linear-gradient(to bottom, #f0e6d8, #e8dcc8)
            `
          }}
        />

        <div className="text-center space-y-10 max-w-md mx-auto relative z-10">
          <div className="relative pulse fade-in-scale">
            <div className="w-48 h-48 mx-auto rounded-full bg-white/80 backdrop-blur-sm p-3 shadow-2xl ring-2 ring-[#d4a5a5]/40">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/monogram.png"
                  alt="U & S Monogram"
                  className="w-full h-full object-cover rounded-full"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 fade-in-up delay-200">
            <div 
              className="text-3xl text-[#9b6b5c] font-normal" 
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Preparing Your Invitation...
            </div>
            <div className="w-full max-w-xs mx-auto">
              <div className="bg-white/60 rounded-full h-2 shadow-inner overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#d4a5a5] to-[#a47060] h-2 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div
                className="text-sm font-medium text-[#9b6b5c] mt-4 tracking-widest"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {loadingProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main Invitation Page ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden fade-in">
      
      
      {/* Base background */}
      <div 
        className="fixed inset-0 bg-white"
      />
      
      {/* Left side floral PNG with gradient blend */}
      <div className="fixed left-0 top-0 bottom-0 w-2/5 md:w-1/3 pointer-events-none z-0 slide-in-left">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Purple%20And%20White%20Floral%20Wedding%20Invitation%20%281%29-YoDbOHHNQ9niuMQc5CIl0LK7HUm8e7.png"
          alt=""
          className="h-full w-full object-contain object-left"
          style={{
            maskImage: "linear-gradient(to right, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 60%, transparent 100%)"
          }}
        />
      </div>
      
      {/* Right side floral PNG (mirrored) with gradient blend */}
      <div className="fixed right-0 top-0 bottom-0 w-2/5 md:w-1/3 pointer-events-none z-0 slide-in-right">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Purple%20And%20White%20Floral%20Wedding%20Invitation%20%281%29-YoDbOHHNQ9niuMQc5CIl0LK7HUm8e7.png"
          alt=""
          className="h-full w-full object-contain object-right scale-x-[-1]"
          style={{
            maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)"
          }}
        />
      </div>
      
      {/* Center gradient overlay for text readability */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, transparent 80%)
          `
        }}
      />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-20">
        <Button
          onClick={() => {
            setCurrentPage("cover")
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current.currentTime = 0
              audioRef.current = null
            }
          }}
          variant="ghost"
          className="text-[#9b6b5c] hover:bg-[#e8dcc8]/50 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          ← Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12 fade-in-up delay-100">
          <p 
            className="text-[#6b4a3c] text-sm tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Bismillahir Rahmanir Raheem
          </p>
          
          <div className="space-y-1">
            <p 
              className="text-[#5a3d32] text-lg tracking-widest"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The Nikkah Ceremony Of
            </p>
          </div>
        </div>

        {/* Names Section */}
        <div className="text-center space-y-4 mb-12">
          <h1
            className="text-6xl md:text-7xl text-[#4a3228] font-normal leading-tight fade-in-up delay-200"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Syed Usman
          </h1>
          <p 
            className="text-4xl text-[#6b4a3c] fade-in-scale delay-300"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            &
          </p>
          <h1
            className="text-6xl md:text-7xl text-[#4a3228] font-normal leading-tight fade-in-up delay-400"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Shafaq
          </h1>
        </div>

        {/* Date Section - Reference Style Layout */}
        <div className="text-center space-y-6 mb-12 fade-in-up delay-500">
          <p 
            className="text-[#6b4a3c] text-sm tracking-[0.4em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            April
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="w-20 h-px bg-[#b8928a]" />
            <span 
              className="text-[#5a3d32] text-sm tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Friday
            </span>
            <span 
              className="text-6xl text-[#5a3d32] font-light"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              3
            </span>
            <span 
              className="text-[#5a3d32] text-sm tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Baad Namaz e Asr
            </span>
            <div className="w-20 h-px bg-[#b8928a]" />
          </div>
          
          <p 
            className="text-[#6b4a3c] text-sm tracking-[0.4em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            2026
          </p>
        </div>

        {/* Venue Section */}
        <div className="text-center space-y-4 mb-12 fade-in-up delay-600">
          <p 
            className="text-[#5a3d32] text-base tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Quran Academy
          </p>
          <p 
            className="text-[#6b4a3c] text-sm tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Yaseenabad Branch
          </p>
          
          <Button
            onClick={handleLocationClick}
            variant="outline"
            className="mt-4 border-[#b8928a] text-[#5a3d32] hover:bg-[#e8dcc8]/50 rounded-full px-8 py-2 text-sm tracking-wider font-medium transition-all duration-300"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            View Location
          </Button>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4a5a5]" />
          <div className="w-2 h-2 rounded-full bg-[#d4a5a5]" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4a5a5]" />
        </div>

        {/* Parents Section */}
        <div className="text-center space-y-6 mb-12 px-4">
          <p 
            className="text-[#5a3d32] text-sm tracking-wider italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Son of Mr. & Mrs. Syed Imran Hussain
          </p>
          <p 
            className="text-[#6b4a3c] text-xl"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            together with
          </p>
          <p 
            className="text-[#5a3d32] text-sm tracking-wider italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Daughter of Mr. & Mrs. Muhammad Amin
          </p>
        </div>

        {/* Countdown Section */}
        <div className="text-center space-y-6 mb-12">
          <p 
            className="text-3xl text-[#5a3d32]"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Counting Down
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Mins" },
              { value: timeLeft.seconds, label: "Secs" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-[#d4a5a5]/30">
                <div 
                  className="text-2xl font-medium text-[#5a3d32]" 
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {value}
                </div>
                <div 
                  className="text-xs text-[#6b4a3c] tracking-wider uppercase font-medium"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={handleSaveTheDate}
            variant="outline"
            className="border-[#b8928a] text-[#5a3d32] hover:bg-[#e8dcc8]/50 rounded-full px-8 py-2 text-sm tracking-wider font-medium transition-all duration-300"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Save The Date
          </Button>
        </div>

        {/* Islamic Quote */}
        <div className="text-center space-y-4 mb-12 px-4 py-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#d4a5a5]/20">
          <p 
            className="text-[#5a3d32] text-sm tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Allah Subhanahu Wa Ta'ala says:
          </p>
          <p 
            className="text-[#4a3228] text-base leading-relaxed italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            "And among His signs is that He created for you mates from among yourselves, 
            that you may dwell in tranquility with them, and He placed between you 
            affection and mercy."
          </p>
          <p 
            className="text-[#5a3d32] text-xs tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            — Surah Ar-Rum (30:21)
          </p>
        </div>

        {/* RSVP Section */}
        <div className="text-center space-y-6 mb-12">
          <p 
            className="text-3xl text-[#5a3d32]"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Kindly Respond
          </p>
          <p 
            className="text-[#4a3228] text-sm tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            +92 311 8335838
          </p>
          <Button
            onClick={handleRSVPClick}
            className="bg-[#6b4a3c] hover:bg-[#5a3d32] text-white rounded-full px-10 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wider"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp RSVP
            </span>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-6 pb-8">
          <p 
            className="text-[#5a3d32] text-sm tracking-wider italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Your presence will add joy to our special day
          </p>
          <p 
            className="text-2xl text-[#6b4a3c]"
            style={{ fontFamily: "Amiri, serif" }}
          >
            ٱلْـحَـمْدُ لِلّٰهِ رَبِّ ٱلْعَٰلَمِينَ
          </p>
        </div>

        {/* Spacer for bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  )
}
