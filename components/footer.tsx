import { FeedbackDialog } from "@/components/feedback/feedback-dialog"

export function Footer() {
  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center mb-4">
        <FeedbackDialog />
      </div>
      <p className="text-sm text-gray-500">© {new Date().getFullYear()} Codin. Share code, not complexity.</p>
      <p className="mt-1 text-sm text-gray-500">
        Created with ❤️ by <span className="text-emerald-600 font-medium">tungnguyentu</span>
      </p>
    </footer>
  )
}
