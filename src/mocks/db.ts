// Simple mock DB with latency to demo skeletons and motion
export type Item = { id: number; title: string; description?: string; price?: number; image: string }

const heroImage =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop'

export const images = {
  hero: heroImage,
}

function delay<T>(data: T, ms = 600) {
  return new Promise<T>((res) => setTimeout(() => res(data), ms))
}

export async function fetchServices(): Promise<Item[]> {
  return delay(
    [
      {
        id: 1,
        title: 'Bảo dưỡng định kỳ',
        description: 'Kiểm tra tổng quát, thay dầu, lọc gió, vệ sinh hệ thống.',
        image:
          'https://images.unsplash.com/photo-1588508065123-13dfd8454fe3?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 2,
        title: 'Sửa chữa chung',
        description: 'Chẩn đoán điện, động cơ, gầm, điều hòa chuyên sâu.',
        image:
          'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 3,
        title: 'Độ xe - nâng cấp',
        description: 'Bodykit, phanh, mâm, lốp, cách âm, màn hình, camera 360.',
        image:
          'https://images.unsplash.com/photo-1606229365485-93a3b8ee03ee?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  )
}

export async function fetchProjects(): Promise<Item[]> {
  return delay(
    Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      title: `Dự án độ xe #${i + 1}`,
      image: `https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1300&auto=format&fit=crop`,
      description: 'Trước/Sau – sơn, bodykit, mâm lốp, phanh.'
    })),
    800,
  )
}

export async function fetchProducts(): Promise<Item[]> {
  return delay(
    Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      title: `Phụ tùng OEM ${i + 1}`,
      price: 1990000 + i * 100000,
      image: 'https://images.unsplash.com/photo-1517957754645-708b2bdebc2b?q=80&w=1200&auto=format&fit=crop',
    })),
  )
}

export async function fetchPosts(): Promise<Item[]> {
  return delay(
    Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      title: `Mẹo chăm xe #${i + 1}`,
      description: 'Những lưu ý bảo dưỡng giúp xe bền bỉ và tiết kiệm.',
      image: 'https://images.unsplash.com/photo-1549921296-3ecf9f2c4d96?q=80&w=1200&auto=format&fit=crop',
    })),
  )
}
