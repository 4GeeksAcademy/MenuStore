import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import MiniUser from "./MiniUser"


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
 // miniUser se movio al navbar de customerHome //
export const Layout = () => {
    return (
        <ScrollToTop>
            <Outlet />
        </ScrollToTop>
    )
}