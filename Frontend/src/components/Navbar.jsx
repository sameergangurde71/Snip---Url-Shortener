import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0e14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-gray-400 sm:inline">
              {user.firstname} {user.lastname ?? ""}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
