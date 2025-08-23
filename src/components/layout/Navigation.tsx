import React from "react";
import { motion } from "framer-motion";
import { NAVIGATION_ITEMS } from "@/utils/constants";
import { scrollToSection } from "@/utils/helpers";

interface NavigationProps {
  activeSection?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-gray-light"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-heading font-bold text-xl text-brand-blue-primary"
          >
            RrishMusic
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                    font-heading font-medium transition-colors duration-300
                    ${
                      activeSection === item.id
                        ? "text-brand-blue-primary"
                        : "text-neutral-charcoal hover:text-brand-blue-primary"
                    }
                  `}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button (we'll implement this later) */}
          <div className="md:hidden">
            <button className="p-2 text-neutral-charcoal">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
