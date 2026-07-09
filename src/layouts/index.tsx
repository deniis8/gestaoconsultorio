import { Outlet, ScrollRestoration } from "react-router-dom";
import { Menu } from "../components/layout/menu";

export function Layout(){
    return (
        <div className="container">
            <Menu />
            <main>
                <Outlet />
                <ScrollRestoration />
            </main>
        </div>
    )
}