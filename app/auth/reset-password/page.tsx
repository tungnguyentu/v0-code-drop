import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-center">
          <Logo />
        </header>

        <main className="py-8">
          <ResetPasswordForm />
        </main>

        <Footer />
      </div>
    </div>
  )
}
