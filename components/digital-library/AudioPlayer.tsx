"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

interface AudioPlayerProps {
  audioUrl: string
  title: string
  artist?: string
  lyrics?: string
  duration?: number
  isNasheed?: boolean
}

export function AudioPlayer({
  audioUrl,
  title,
  artist,
  lyrics,
  duration,
  isNasheed,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
    } else {
      audioRef.current.volume = 0
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const totalDuration = audioRef.current?.duration || duration || 0

  // Guard: Return empty if no audio URL
  if (!audioUrl) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20"
    >
      <audio ref={audioRef} src={audioUrl || ""} crossOrigin="anonymous" />

      {/* Title and Artist */}
      <div className="mb-4">
        <p className="font-bold text-foreground">{title}</p>
        {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
      </div>

      {/* Lyrics Section (for Nasheeds) */}
      {lyrics && isNasheed && (
        <div className="mb-4 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto text-sm text-foreground text-right">
          <p className="whitespace-pre-wrap">{lyrics}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ms-0.5" />
          )}
        </motion.button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 ms-auto">
          <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition">
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  )
}
