"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function Home() {
    const router = useRouter()
    const {data: session} = authClient.useSession() 

    async function signOut(){
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/"); // redirect to login page
            toast.success("Signed out successfully")
          },
        },
      });
    }


  return (
    <div>
      <h1>Hello World</h1>
      <ThemeToggle />
      {session ?(
        <div>
          <h1>{session.user.name}</h1>
          <Button
            onClick={signOut}
          >
            Sign out
          </Button>
        </div>
      ):(
        <Button>Sign in</Button>
      )}
    </div>
  );
}
