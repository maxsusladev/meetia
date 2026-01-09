"use client";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


/**
 * Renders the home page with authentication-aware UI that shows sign-up and sign-in forms when unauthenticated and a signed-in view with a sign-out control when authenticated.
 *
 * The sign-up and sign-in controls invoke the authentication client; success and error outcomes produce user alerts.
 *
 * @returns The React element for the home page UI, conditionally presenting authentication forms or the signed-in view based on session state.
 */
export default function Home() {


  const { data: session } = authClient.useSession()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {
      onError: () => {
        window.alert("Somthing went wrong")
      },
      onSuccess: () => {
        window.alert("Success")
      }
    })
  }
  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    }, {
      onError: () => {
        window.alert("Somthing went wrong")
      },
      onSuccess: () => {
        window.alert("Success")
      }
    })
  }

  if (session) {
    return (

      <div className="flex flex-col p-4 gap-y-4">
        <p> Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }
  return (

    <div className=" flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4" >
        <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button onClick={onSubmit}>
          create user
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4" >
        <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>

  )
}