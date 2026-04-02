import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div>
      Dashboard
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </div>
  )
}
