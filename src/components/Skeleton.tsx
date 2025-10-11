type Props = {
  className?: string
}

export default function Skeleton({ className = '' }: Props) {
  return <div className={`animate-pulse rounded-md bg-neutral-200/70 ${className}`} />
}

