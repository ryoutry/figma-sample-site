import { useEffect, useState } from "react";
import SiteLayout from "./components/SiteLayout";
import AdminPage from "./pages/AdminPage";
import ContentPage from "./pages/ContentPage";
import HomePage from "./pages/HomePage";

function getRoute() {
  return window.location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleRoute = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("hashchange", handleRoute);
    return () => window.removeEventListener("hashchange", handleRoute);
  }, []);

  const isHome = route === "home";

  if (route === "admin") return <AdminPage />;

  return (
    <SiteLayout isHome={isHome} route={route}>
      {isHome ? <HomePage /> : <ContentPage route={route} />}
    </SiteLayout>
  );
}
