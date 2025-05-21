
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 dark:bg-portfolio-charcoal py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-xl gradient-text">John Portfolio</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Building digital experiences with code and creativity</p>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} John Portfolio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
