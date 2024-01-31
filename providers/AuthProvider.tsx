import React, { useContext, createContext, useState } from "react";
import { redirect } from "next/navigation";

const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("auth") || "");

	const login = async (data: { email: string; password: string }) => {
		try {
			const response = await fetch("localhost:3001/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const res = await response.json();
			if (res.data) {
				setUser(res.data.user);
				setToken(res.token);
				localStorage.setItem("auth", res.token);
				redirect("/");
			}
			throw new Error(res.message);
		} catch (err) {
			console.error(err);
		}
	};

	const logOut = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("site");
		redirect("/login");
	};

	return (
		<AuthContext.Provider value={{ token, user, login, logOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};
