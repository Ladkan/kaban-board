import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import { Toaster } from "sonner";

export default function Layout(){

    return(
        <>
            <Toaster closeButton position="top-right" richColors/>
            <Sidebar />
            <Header />
            <main className="md:ml-64 pt-16 px-6 pv-6 md:pt-24 md:px-12 md:pv-12 h-full">
                <Outlet />
            </main>
        </>
    )
}