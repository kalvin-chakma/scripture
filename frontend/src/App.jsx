import { Routes } from "react-router-dom";
import { routes } from "./routes/routes";
import useUserStore from "./store/useUserStore";
import { useEffect } from "react";

export default function App() {
  const theme = useUserStore((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  return <Routes>{routes}</Routes>;
}
