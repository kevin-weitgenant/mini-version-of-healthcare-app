import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-balance mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-8">
        <Image
          src="/modern-healthcare-medical-illustration-with-stetho.jpg"
          alt="Healthcare illustration"
          width={512}
          height={512}
          className="max-w-lg w-full h-auto rounded-lg"
        />
      </div>
    </div>
  )
}
