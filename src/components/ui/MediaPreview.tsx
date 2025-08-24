/**
 * Media Preview Components - Issue #49 Implementation
 * 
 * Provides audio and video preview functionality for portfolio content
 * - 30-second audio previews with custom controls
 * - Video previews with thumbnail overlays
 * - Mobile-optimized media players
 * - Progressive loading for performance
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface BasePreviewProps {
  title: string;
  description: string;
  className?: string;
}

interface AudioPreviewProps extends BasePreviewProps {
  type: 'audio';
  audioUrl: string;
  duration: number; // in seconds (30 for preview)
  genre: string[];
  thumbnail?: string;
}

interface VideoPreviewProps extends BasePreviewProps {
  type: 'video';
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  embedUrl?: string; // for YouTube/Vimeo
}

type MediaPreviewProps = AudioPreviewProps | VideoPreviewProps;

/**
 * Audio Preview Player Component
 */
const AudioPreviewPlayer: React.FC<AudioPreviewProps> = ({
  title,
  description,
  audioUrl,
  duration,
  genre,
  thumbnail,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Audio event handlers
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* Thumbnail/Visual */}
      {thumbnail && (
        <div className="relative h-48 bg-gradient-to-r from-brand-blue-primary to-brand-orange-primary">
          <img
            src={thumbnail}
            alt={`${title} audio preview thumbnail`}
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl text-white opacity-80">🎵</div>
          </div>
        </div>
      )}
      
      {/* Audio Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <div className="flex flex-wrap gap-1">
              {genre.map((g, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-brand-blue-light text-brand-blue-primary rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-3">
          {/* Play/Pause and Time */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="flex items-center justify-center w-12 h-12 bg-brand-blue-primary text-white rounded-full hover:bg-brand-blue-dark transition-colors duration-200 disabled:opacity-50"
              aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
              <span className="ml-2 px-2 py-1 bg-brand-orange-light text-brand-orange-primary rounded text-xs">
                30s Preview
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer group"
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue-primary to-brand-orange-primary rounded-full"
              style={{ width: `${progressPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.1 }}
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-blue-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercentage}% - 8px)` }}
            />
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={handleLoadedData}
          onEnded={handleEnded}
          preload="metadata"
        />
      </div>
    </motion.div>
  );
};

/**
 * Video Preview Player Component
 */
const VideoPreviewPlayer: React.FC<VideoPreviewProps> = ({
  title,
  description,
  videoUrl,
  thumbnail,
  duration,
  embedUrl,
  className = ''
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* Video Thumbnail/Player */}
      <div className="relative aspect-video bg-gray-900">
        <AnimatePresence>
          {!showVideo ? (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full cursor-pointer group"
              onClick={handlePlayClick}
            >
              <img
                src={thumbnail}
                alt={`${title} video preview thumbnail`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 group-hover:scale-110 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-8 h-8 text-brand-blue-primary ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {formatDuration(duration)}
              </div>

              {/* Preview Badge */}
              <div className="absolute top-3 left-3 bg-brand-orange-primary text-white px-2 py-1 rounded text-xs font-medium">
                Preview
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${title} video preview`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={thumbnail}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

/**
 * Main Media Preview Component
 */
export const MediaPreview: React.FC<MediaPreviewProps> = (props) => {
  if (props.type === 'audio') {
    return <AudioPreviewPlayer {...props} />;
  } else {
    return <VideoPreviewPlayer {...props} />;
  }
};

export default MediaPreview;