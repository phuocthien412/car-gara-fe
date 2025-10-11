import { useEffect, useRef, useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  threshold?: number
}

export default function LazyImage({ threshold = 0.1, className, ...props }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <img
      ref={imgRef}
      className={`transition duration-700 ease-out will-change-transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'} ${className ?? ''}`}
      {...props}
      loading="lazy"
    />
  )
}

