"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  title: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (title: string, message: string, type: ToastType = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, message, type }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg max-w-xs animate-slide-in ${
              toast.type === "error"
                ? "bg-destructive text-white"
                : toast.type === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{toast.title}</h4>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
            <p className="text-sm mt-1">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

