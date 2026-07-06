import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, BookOpen, Flame, Info, LogOut, Menu, Briefcase, MessageSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useAppDispatch } from "@/store/hooks";
import { clearCredentials } from "@/store/authSlice";

const SideBar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navItems = [
    { name: "Home", icon: <Home />, path: "/" },
    { name: "Discover", icon: <Compass />, path: "/discover" },
    { name: "Library", icon: <BookOpen />, path: "/library" },
    { name: "Hots", icon: <Flame />, path: "/hots" },
    { name: "Opportunities", icon: <Briefcase />, path: "/research-opportunities" },
    { name: "About", icon: <Info />, path: "/about" },
    { name: "Contact", icon: <MessageSquare />, path: "/contact" },
  ];

  const handleSignOut = async () => {
    fetch("/api/auth/signout", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          dispatch(clearCredentials());
          alert("Signed out successfully");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Sign out error:", err);
      });
  };

  return (
    <>
      <motion.div
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col justify-between bg-gradient-to-b from-[#050519] to-[#0c1126] py-6 text-white shadow-lg lg:flex"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Top Section */}
        <div className="px-4">
          <div className="mb-8 flex items-center justify-between px-2">
            <motion.h1
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="overflow-hidden whitespace-nowrap text-2xl font-extrabold tracking-wide text-cyan-400"
            >
              PaperHunt
            </motion.h1>
            <Menu className="h-6 w-6 cursor-pointer text-gray-400" />
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  data-tooltip-id={item.name}
                  data-tooltip-content={item.name}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2 transition-all duration-200 ${isActive
                    ? "bg-cyan-600/20 text-cyan-300"
                    : "text-gray-300 hover:bg-cyan-700/10 hover:text-cyan-200"
                    }`}
                >
                  <span className="h-6 w-6 shrink-0">{item.icon}</span>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-auto px-4">
          <div
            data-tooltip-id="Sign Out"
            data-tooltip-content="Sign Out"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-gray-300 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <button onClick={handleSignOut}>
                    Sign Out
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tooltip for collapsed mode */}
        {!isExpanded && (
          <Tooltip
            id="sidebar-tooltips"
            place="right"
            // effect="solid"
            className="z-50"
          />
        )}
      </motion.div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="flex gap-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors ${isActive
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className="h-5 w-5">{item.icon}</span>
                <span className="max-w-full truncate">{item.name}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="max-w-full truncate">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
