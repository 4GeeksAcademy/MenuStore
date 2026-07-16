import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
 // miniUser se movio al navbar de customerHome //
export const Layout = () => {
    return (
        <ScrollToTop>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Outlet />

        </ScrollToTop>
    )
}