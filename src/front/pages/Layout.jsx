import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import MiniUser from "./MiniUser"


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <MiniUser />
            <Outlet />
        </ScrollToTop>
    )
}