import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import UserProfile from "../Pages/UserProfile";

function AppRoutes() {
    return (
        <Routes>

            <Route element={<MainLayout />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/users/:id"
                    element={<UserProfile />}
                />

            </Route>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

        </Routes>
    );
}

export default AppRoutes;