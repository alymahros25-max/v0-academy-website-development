'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { formatDuration } from '@/lib/library-utils'

interface AudioPlayerProps {
  audioUrl?: string
  title: string
  artist?: string
  duration?: number
  autoPlay?: boolean
}

export function AudioPlayer({
  audioUrl,
  title,
  artist,
  duration,
  autoPlay = false
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  if (!audioUrl) return null

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  const totalDuration = duration || (audioRef.current?.duration ?? 0)

  return (
    <div className="w-full bg-card border border-border rounded-lg p-4 space-y-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        autoPlay={autoPlay}
      />

      {/* Info */}
      <div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        {artist && <p className="text-xs text-muted-foreground">{artist}</p>}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={totalDuration || 100}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ms-0.5" />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={handleMute}
            className="p-1.5 hover:bg-muted rounded-lg transition flex-shrink-0"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Volume"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{isMuted ? 0 : volume}%</span>
        </div>
      </div>
    </div>
  )
}
