import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GoogleLoginButton } from "@/features/auth";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/features/auth";

function LoginPage() {
  return (
    <Suspense>
      <Card className="border-0 py-4">
        <CardHeader className="gap-2 text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentails to get back!</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col">
          <div className="relative mb-8 w-full">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground">
              or
            </span>
          </div>
          <GoogleLoginButton />
          <div className="mt-4 text-center text-sm font-medium">
            <span>Don&apos; have an account?</span>
            <Button
              asChild
              variant="link"
              size="sm"
              className="h-auto px-2 text-[15px]"
            >
              <Link href="/signup">Signup</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Suspense>
  );
}

export default LoginPage;
