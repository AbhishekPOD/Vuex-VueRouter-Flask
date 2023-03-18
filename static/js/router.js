
import Home from "./components/home.js";
import About from "./components/about.js";
import ContactUs from "./components/contact.js";
import Course from "./components/course.js";
import Cart from "./components/acart.js";

const routes = [
    {
        path : "/",
        component : Home,
    },
    {
        path : "/about",
        component : About,
    },
    {
        path : "/contact-us",
        component : ContactUs,
    },
    {
        path : "/course/:id",
        component : Course,
        // props : True
    },
    {
        path : "/cart",
        component : Cart,
    },
]

const router = new VueRouter({
    routes
})

export default router;