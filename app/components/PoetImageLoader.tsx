import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton"

interface PoetImageLoaderProps {
  name: string
  imageUrl: string
  backgroundUrl: string
  className?: string
}

export function PoetImageLoader({ name, imageUrl, backgroundUrl, className = "" }: PoetImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all([
          new Promise((resolve, reject) => {
            const img = new Image()
            img.src = imageUrl
            img.onload = resolve
            img.onerror = reject
          }),
          new Promise((resolve, reject) => {
            const img = new Image()
            img.src = backgroundUrl
            img.onload = resolve
            img.onerror = reject
          })
        ])
        setIsLoading(false)
      } catch (err) {
        setError(true)
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [imageUrl, backgroundUrl])

  if (isLoading) {
    return <Skeleton className={`h-full w-full ${className}`} />
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <span className="text-muted-foreground">Failed to load image</span>
      </div>
    )
  }

  return (
    <div 
      className={`relative bg-cover bg-center ${className}`} 
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
      <div className="relative h-full p-4 flex flex-col justify-end text-white">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src={imageUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
          />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
        </div>
      </div>
    </div>
  )
} 