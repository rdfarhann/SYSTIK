import { LoginForm } from "@/app/login/login-form";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <head>
        <title>SYSTIK</title>
        <meta name="description" content="Selamat datang di situs saya." />
        <link rel="icon" href="/systik.svg" />
      </head>
      <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bgkujang.png')" }}>
        <main>
          <LoginForm/>
        </main>
      </div>
    </>
  );
}
