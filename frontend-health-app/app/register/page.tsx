import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-balance mb-2">Create an account</h1>
            <p className="text-muted-foreground">Get started with your healthcare journey</p>
          </div>
          <RegisterForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-8">
        <img
          src="/modern-healthcare-medical-team-illustration-with-d.jpg"
          alt="Healthcare team illustration"
          className="max-w-lg w-full h-auto rounded-lg"
        />
      </div>
    </div>
  )
}
