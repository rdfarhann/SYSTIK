import { LoginForm } from "@/components/layout/login-form"

export default function Home() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/bgkujang.png')" }}
    >
      <div className="w-full max-w-[360px] h-fit z-10">
        <LoginForm />
      </div>
    </div>
  )
}