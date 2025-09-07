import BuildStore from "@/components/build-store";
import { verifySessionFromUi } from "@/lib/session";


export default async function Home() {
 const session = await verifySessionFromUi()

  if(session?.role === 'superAdmin'){
    return <BuildStore/>
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      Store belum ada mohon hubungi pemiliki toko
    </div>
  )
 
}
