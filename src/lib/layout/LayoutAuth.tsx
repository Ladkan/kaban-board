import { Outlet } from "react-router-dom";

export default function LayoutAuth(){
    return(
        <>
            <main className="flex grow items-center justify-center px-6 relative overflow-hidden">
                <Outlet />
            </main>
        </>
    )
}