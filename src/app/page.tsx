import { LoginForm } from "@/app/login/login-form"


export default function Home() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bgkujang.png')" }}
    >
      <main>
        <LoginForm/>
      </main>
    </div>
  )
}
