import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ChevronRight } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-12 border-t border-brand dark:border-brand">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white font-display">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/our-mission"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white font-display">
              Customer Service
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white font-display">
              Contact Us
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex flex-col justify-center items-start gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand mt-1 flex-shrink-0" />
                  <div className="text-gray-600 dark:text-gray-400">
                    <p>123 Main Street</p>
                    <p>Anytown, USA 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand flex-shrink-0" />
                  <a
                    href="mailto:info@babeslove.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors"
                  >
                    info@babeslove.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand flex-shrink-0" />
                  <a
                    href="tel:+1234567890"
                    className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors"
                  >
                    (123) 456-7890
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-brand dark:border-brand">
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} Babes Love. All rights reserved.
            </p>
            <div className="flex justify-center items-center gap-6 text-sm">
              <Link
                to="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors"
              >
                Terms of Service
              </Link>
              <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <Link
                to="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
