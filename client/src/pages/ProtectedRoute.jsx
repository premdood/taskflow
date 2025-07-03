import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigation } from "react-router";
import {
  Header,
  Loader,
  MobileSidebar,
  Sidebar,
} from "../components/Index.jsx";

function ProtectedRoute() {
  const location = useLocation();
  const containerRef = useRef(null);
  const { token, user } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  // restore scroll to top
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [location.pathname]);

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <main className="min-h-screen w-full bg-[var(--secondary-color)] font-['Arial']">
      <div className="flex h-screen w-full flex-col md:flex-row">
        <div className="sticky top-0 hidden h-screen w-1/10 min-w-70 bg-white md:block lg:max-w-80">
          <Sidebar />
        </div>

        <MobileSidebar />

        <div
          ref={containerRef}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <Header />
          <div className="relative flex-1 p-4 2xl:px-10">
            {isNavigating ? <Loader /> : <Outlet />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProtectedRoute;
