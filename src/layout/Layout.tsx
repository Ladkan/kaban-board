import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

export default function Layout(){

    return(
        <>
            <Sidebar />
            <Header />
            <main className="md:ml-64 pt-24 px-12 pv-12">
                <Outlet />
            </main>
        </>
    )
}