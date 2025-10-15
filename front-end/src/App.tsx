import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/secureRoutes/ProtectedRoute";
import Home from "./pages/Home";
import Assets from "./pages/Assets";
import Transactions from "./pages/Transactions";
// import NavigationBar from "./components/NavigationBar";

export default function App() {
	const token = useAuthStore((s) => s.token);

	return (
		<>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/home"
					element={
						<ProtectedRoute isAllowed={!!token}>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/assets"
					element={
						<ProtectedRoute isAllowed={!!token}>
							<Assets />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/transactions"
					element={
						<ProtectedRoute isAllowed={!!token}>
							<Transactions />
						</ProtectedRoute>
					}
				/>
			</Routes>
			{/* <NavigationBar /> */}
		</>
	);
}
