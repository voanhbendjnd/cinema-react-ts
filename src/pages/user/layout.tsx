import { Outlet } from "react-router-dom";
import HomeHeader from "@/pages/user/header.tsx";
import HomeFooter from "@/pages/user/footer.tsx";
import ChatbotWidget from "@/components/chatbot";
import "@/styles/home.css";

const HomeLayout = () => {
    return (
        <>
            <HomeHeader />

            <main>
                <Outlet />
            </main>

            <HomeFooter />
            <ChatbotWidget />
        </>
    );
};

export default HomeLayout;
