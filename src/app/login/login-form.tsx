import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
          <Image 
            src="/systik.svg"
            alt="systik logo"
            width={250}
            height={250}
            priority
          />
          </div>
          <CardTitle className="text-xl">Welcome back to SYSTIK</CardTitle>
          <CardDescription>
            Login with your Employee Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="stirng"
                  type="string"
                  placeholder="Enter your username"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input 
                id="password" 
                type="password"
                placeholder="Enter your password"
                required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>  
            </FieldGroup>
             <footer className=" py-4 px-4 text-center text-sm text-black font-normal">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.pupuk-kujang.co.id/"
              className="underline font-semibold hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              PT Pupuk Kujang Cikampek
            </a>
            . All rights reserved.
           </footer>
          </form>
        </CardContent>
      </Card>
      
    </div>
  )
}
