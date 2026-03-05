import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button';
import { APP_NAME } from '../../../utils/constants';

export const Header = () => {
  const { t, language, changeLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              {APP_NAME}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/gallery"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {t('navigation.explore')}
            </Link>
            {/* Artists link - will be implemented when artists list page is created */}
            {/* <Link
              to="/artists"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {t('navigation.artists')}
            </Link> */}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-6">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'es'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                aria-label="Cambiar a español"
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                aria-label="Change to English"
              >
                EN
              </button>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${user?.role}/dashboard`}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {t('navigation.myAccount')}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  {t('auth.login')}
                </Link>
                <Link to="/register">
                  <Button size="sm">{t('auth.register')}</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/gallery"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.explore')}
              </Link>
              {/* Artists link */}
              {/* <Link
                to="/artists"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.artists')}
              </Link> */}

              {/* Language Switcher */}
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600 mr-2">{t('common.language') || 'Idioma'}:</span>
                <button
                  onClick={() => {
                    changeLanguage('es');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'es'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <>
                  <Link
                    to={`/${user?.role}/dashboard`}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('navigation.myAccount')}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    {t('auth.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button size="sm" className="w-full">
                      {t('auth.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
