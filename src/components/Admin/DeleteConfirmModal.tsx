interface DeleteConfirmModalProps {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

/**
 * Reusable delete confirmation modal
 */
export default function DeleteConfirmModal({
  itemName,
  onConfirm,
  onCancel,
  isDeleting = false
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-md rounded-lg bg-neutral-900 p-5" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
        <p className="mt-2 text-sm text-neutral-400">
          Bạn có chắc muốn xóa: <strong className="text-white">{itemName}</strong>?
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  )
}
