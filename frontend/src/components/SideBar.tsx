import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, BookOpen, Flame, Info, LogOut, Menu, Briefcase } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const SideBar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", icon: <Home />, path: "/" },
    { name: "Discover", icon: <Compass />, path: "/discover" },
    { name: "Library", icon: <BookOpen />, path: "/library" },
    { name: "Hots", icon: <Flame />, path: "/hots" },
    { name: "Opportunities", icon: <Briefcase />, path: "/research-opportunities" },
    { name: "About", icon: <Info />, path: "/about" },
  ];

  const handleSignOut = async () => {
    fetch("/api/auth/signout", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          alert("Signed out successfully");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Sign out error:", err);
      });
  };

  return (
    <motion.div
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#050519] to-[#0c1126] text-white shadow-lg flex flex-col justify-between py-6 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Top Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-8 px-2">
          <motion.h1
            animate={{ opacity: isExpanded ? 1 : 0 }}
            className="text-2xl font-extrabold tracking-wide text-cyan-400 whitespace-nowrap overflow-hidden"
          >
            PaperHunt
          </motion.h1>
          <Menu className="text-gray-400 w-6 h-6 cursor-pointer" />
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
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-cyan-600/20 text-cyan-300"
                  : "text-gray-300 hover:bg-cyan-700/10 hover:text-cyan-200"
                  }`}
              >
                <span className="w-6 h-6">{item.icon}</span>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium overflow-hidden"
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
          className="flex items-center gap-3 w-full text-gray-300 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
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
  );
};

export default SideBar;
