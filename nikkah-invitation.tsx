"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

export default function Component() {
  const [currentPage, setCurrentPage] = useState("cover")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioStartedRef = useRef(false)

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
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

  const startAudio = () => {
    // Strict guard - only play once
    if (audioStartedRef.current) {
      return
    }
    audioStartedRef.current = true

    // Create audio element only once
    if (!audioRef.current) {
      const audio = new Audio()
      audio.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0627%282%29-fHKFYsFQhHNnJVWGHooruickURw9h3.MP3"
      audio.loop = true
      audio.volume = 0.7
      audio.preload = "auto"
      audioRef.current = audio
    }

    // Play with error handling
    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Reset flag if autoplay blocked
        audioStartedRef.current = false
      })
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioStartedRef.current = false
  }

  const handleOpenInvitation = () => {
    setCurrentPage("loading")
    setLoadingProgress(0)
    
    // Reset audio state for fresh start
    audioStartedRef.current = false

    let localProgress = 0
    let audioTriggeredLocal = false

    progressIntervalRef.current = setInterval(() => {
      localProgress += 2
      
      // Trigger audio exactly once at 50%
      if (localProgress >= 50 && !audioTriggeredLocal) {
        audioTriggeredLocal = true
        startAudio()
      }

      if (localProgress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
        setLoadingProgress(100)
        setTimeout(() => setCurrentPage("invitation"), 500)
        return
      }
      
      setLoadingProgress(localProgress)
    }, 60)
  }

  // ─── Cover Page with Video Background ────────────────────────────────────────
  if (currentPage === "cover") {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Video Background */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pink%20Floral%20Wedding%20Invitation%20Video-U8HsFL0ugshdsks5zzScW6prKKyfnY.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="text-center space-y-10 max-w-md mx-auto relative z-10">
          <div className="space-y-2 fade-in-up delay-100">
            <p 
              className="text-[#6b5548] text-xl tracking-widest drop-shadow-sm"
              style={{ fontFamily: "Amiri, serif" }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p 
              className="text-[#8b7355] text-sm tracking-[0.2em] mt-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>

          {/* Main Title */}
          <div className="fade-in-scale delay-200">
            <h2 
              className="text-4xl md:text-5xl text-[#8b7355] font-normal tracking-wider drop-shadow-sm"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Nikkah Mubarak
            </h2>
          </div>

          {/* Names in elegant script */}
          <div className="space-y-4">
            <h1
              className="text-6xl md:text-7xl text-[#6b5548] font-normal leading-tight drop-shadow-sm fade-in-up delay-300"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Usman
            </h1>
            <p 
              className="text-4xl text-[#c9a0a0] drop-shadow-sm fade-in-scale delay-400"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              &
            </p>
            <h1
              className="text-6xl md:text-7xl text-[#6b5548] font-normal leading-tight drop-shadow-sm fade-in-up delay-500"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Shafaq
            </h1>
          </div>

          {/* Arabic blessing */}
          <div
            className="text-2xl text-[#8b7355] font-normal tracking-wider drop-shadow-sm fade-in-up delay-600"
            style={{ fontFamily: "Amiri, serif" }}
          >
            ٱلْـحَـمْدُ لِلّٰهِ
          </div>

          <div className="pt-4 fade-in-scale delay-700">
            <Button
              onClick={handleOpenInvitation}
              className="bg-[#8b7355] hover:bg-[#6b5548] text-white rounded-full px-12 py-4 text-base font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 tracking-wider gentle-bounce"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Open Invitation
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Loading Page with Video Background ─────────────────────────────────────
  if (currentPage === "loading") {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Video Background */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pink%20White%20Elegant%20Watercolor%20International%20Women%27s%20Day%208%20March%20Greeting%20VIdeo-Y7wtMDktodczZtIEi8EFKloUWAn47D.mp4"
              type="video/mp4"
            />
          </video>
          {/* Light overlay for content readability */}
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div className="text-center space-y-10 max-w-md mx-auto relative z-10">
          <div className="relative pulse fade-in-scale">
            <div className="w-48 h-48 mx-auto rounded-full bg-[#f5efe6]/90 backdrop-blur-sm p-3 shadow-2xl ring-2 ring-[#c9a0a0]/40">
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
              className="text-3xl text-[#8b7355] font-normal" 
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Preparing Your Invitation...
            </div>
            <div className="w-full max-w-xs mx-auto">
              <div className="bg-[#f5efe6]/80 rounded-full h-2 shadow-inner overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#c9a0a0] to-[#8b7355] h-2 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div
                className="text-sm font-medium text-[#8b7355] mt-4 tracking-widest"
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

  // ─── Main Invitation Page with Floral Border Background ─────────────────────────
  return (
    <div className="min-h-screen relative fade-in">
      {/* Mobile Background - Tall floral image that scrolls with content */}
      <div 
        className="absolute inset-0 md:hidden"
        style={{ zIndex: -2 }}
      >
        <img
          src="/floral-mobile.png"
          alt=""
          className="w-full h-auto min-h-full object-cover object-top"
        />
      </div>
      {/* Desktop Background */}
      <div 
        className="hidden md:block fixed inset-0"
        style={{ zIndex: -2 }}
      >
        <img
          src="/floral-border.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* Subtle overlay for content readability */}
      <div 
        className="fixed inset-0 bg-white/20"
        style={{ zIndex: -1 }}
      />

      {/* Back Button */}
      <div className="fixed top-4 left-4" style={{ zIndex: 10 }}>
        <Button
          onClick={() => {
            setCurrentPage("cover")
            stopAudio()
          }}
          variant="ghost"
          className="text-[#6b5548] hover:bg-[#f5efe6]/70 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-[#c9a0a0]/30"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          ← Back
        </Button>
      </div>

      {/* Main Content - Extra top padding on mobile to start below top flowers */}
      <div className="relative max-w-lg mx-auto px-5 pt-36 md:pt-12 pb-12" style={{ zIndex: 1 }}>
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16 px-3 py-6 bg-white/70 backdrop-blur-sm rounded-2xl fade-in-up delay-100">
          <p 
            className="text-[#6b5548] text-xl tracking-[0.15em] font-medium"
            style={{ fontFamily: "Amiri, serif" }}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p 
            className="text-[#8b7355] text-xs tracking-[0.1em]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
          
          <div className="space-y-2 pt-2">
            <h2 
              className="text-3xl md:text-4xl text-[#8b7355]"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Nikkah Mubarak
            </h2>
            <p 
              className="text-[#6b5548] text-xs tracking-[0.1em] mt-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Assalamualaikum Warahmatullahi Wabarakatuh
            </p>
          </div>
        </div>

        {/* Parents Invitation */}
        <div className="text-center space-y-4 mb-10 px-4 py-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9a0a0]/30 shadow-lg fade-in-up delay-200">
          <p 
            className="text-[#6b5548] text-sm tracking-wider leading-relaxed"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Mr. & Mrs. Syed Imran Hussain
          </p>
          <p 
            className="text-[#8b7355] text-lg"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            and
          </p>
          <p 
            className="text-[#6b5548] text-sm tracking-wider leading-relaxed"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Mr. & Mrs. Muhammad Amin
          </p>
          <p 
            className="text-[#8b7355] text-sm tracking-wider pt-2 italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            request the pleasure of your company at the Nikkah ceremony of their beloved children
          </p>
        </div>

        {/* Names Section */}
        <div className="text-center space-y-3 mb-10 px-3 py-6 bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="fade-in-up delay-300">
            <h1
              className="text-4xl md:text-6xl text-[#6b5548] font-normal leading-tight"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Syed Usman Hussain
            </h1>
            <p 
              className="text-[#8b7355] text-xs tracking-wider mt-1 italic"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Son of Syed Imran Hussain
            </p>
          </div>
          <p 
            className="text-3xl text-[#c9a0a0] fade-in-scale delay-400"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            with
          </p>
          <div className="fade-in-up delay-500">
            <h1
              className="text-4xl md:text-6xl text-[#6b5548] font-normal leading-tight"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Shafaq Amin
            </h1>
            <p 
              className="text-[#8b7355] text-xs tracking-wider mt-1 italic"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Daughter of Muhammad Amin
            </p>
          </div>
        </div>

        {/* Save the Date Section */}
        <div className="text-center space-y-3 mb-8 px-3 py-5 bg-white/60 backdrop-blur-sm rounded-2xl fade-in-up delay-600">
          <h3 
            className="text-2xl md:text-3xl text-[#8b7355]"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Save the Date
          </h3>
          <p 
            className="text-[#6b5548] text-xs tracking-wider leading-relaxed"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            By seeking the grace and blessings of Allah Subhanahu Wa Ta&apos;ala, we are honored to hold the following event:
          </p>
        </div>

        {/* Date Section */}
        <div className="text-center space-y-4 mb-10 px-3 py-6 bg-white/70 backdrop-blur-sm rounded-2xl fade-in-up delay-700">
          <p 
            className="text-[#6b5548] text-base tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Nikkah Ceremony
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <p 
              className="text-[#8b7355] text-sm tracking-[0.3em] uppercase font-medium"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              April
            </p>
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 md:w-16 h-px bg-[#c9a0a0]" />
              <span 
                className="text-[#6b5548] text-xs tracking-[0.15em] uppercase font-medium"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Friday
              </span>
              <span 
                className="text-5xl md:text-6xl text-[#6b5548] font-light"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                3
              </span>
              <span 
                className="text-[#6b5548] text-xs tracking-[0.15em] uppercase font-medium"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                2026
              </span>
              <div className="w-10 md:w-16 h-px bg-[#c9a0a0]" />
            </div>

            <p 
              className="text-[#8b7355] text-sm tracking-[0.15em] uppercase font-medium"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Baad Namaz-e-Asr
            </p>
          </div>
        </div>

        {/* Venue Section */}
        <div className="text-center space-y-4 mb-12 px-4 py-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9a0a0]/30 shadow-lg fade-in-up delay-800">
          <p 
            className="text-[#8b7355] text-sm tracking-[0.15em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Venue
          </p>
          <p 
            className="text-[#6b5548] text-lg tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Quran Academy
          </p>
          <p 
            className="text-[#8b7355] text-sm tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Yaseenabad Branch
          </p>
          
          <Button
            onClick={handleLocationClick}
            variant="outline"
            className="mt-4 border-[#c9a0a0] text-[#6b5548] hover:bg-white/50 rounded-full px-8 py-2 text-sm tracking-wider font-medium transition-all duration-300"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            View Location
          </Button>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a0a0]" />
          <div className="w-2 h-2 rounded-full bg-[#c9a0a0]" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a0a0]" />
        </div>

        {/* Countdown Section */}
        <div className="text-center space-y-4 mb-10 px-3 py-6 bg-white/60 backdrop-blur-sm rounded-2xl fade-in-up">
          <p 
            className="text-2xl md:text-3xl text-[#8b7355]"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Counting Down
          </p>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Mins" },
              { value: timeLeft.seconds, label: "Secs" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                <div 
                  className="text-xl font-medium text-[#6b5548]" 
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {value}
                </div>
                <div 
                  className="text-[10px] text-[#8b7355] tracking-wider uppercase font-medium"
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
            className="border-[#c9a0a0] text-[#6b5548] hover:bg-white/50 rounded-full px-6 py-2 text-xs tracking-wider font-medium transition-all duration-300"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Save The Date
          </Button>
        </div>

        {/* Islamic Quote */}
        <div className="text-center space-y-3 mb-10 px-3 py-5 bg-white/70 backdrop-blur-sm rounded-2xl fade-in-up">
          <p 
            className="text-[#8b7355] text-xs tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Allah Tabarak wa Ta&apos;ala says:
          </p>
          <p 
            className="text-[#6b5548] text-xs leading-relaxed italic px-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            &quot;And among His signs is that He created for you mates from among yourselves, 
            that you may dwell in tranquility with them, and He placed between you 
            affection and mercy. Indeed, in that are signs for a people who give thought.&quot;
          </p>
          <p 
            className="text-[#8b7355] text-[10px] tracking-[0.15em] uppercase font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            — Surah Ar-Rum (30:21)
          </p>
        </div>

        {/* RSVP Section */}
        <div className="text-center space-y-4 mb-10 px-3 py-5 bg-white/60 backdrop-blur-sm rounded-2xl fade-in-up">
          <p 
            className="text-2xl md:text-3xl text-[#8b7355]"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Kindly Respond
          </p>
          <p 
            className="text-[#6b5548] text-xs tracking-wider font-medium"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            +92 311 8335838
          </p>
          <Button
            onClick={handleRSVPClick}
            className="bg-[#8b7355] hover:bg-[#6b5548] text-white rounded-full px-8 py-2 text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wider"
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
        <div className="text-center space-y-4 pb-6 px-3 py-5 bg-white/60 backdrop-blur-sm rounded-2xl fade-in-up">
          <p 
            className="text-[#8b7355] text-xs tracking-wider italic"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Your presence will add joy to our special day
          </p>
          <p 
            className="text-xl text-[#6b5548]"
            style={{ fontFamily: "Amiri, serif" }}
          >
            ٱلْـحَـمْدُ لِلّٰهِ رَبِّ ٱلْعَٰلَمِينَ
          </p>
        </div>

        {/* Spacer for bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  )
}
