import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { APP_NAME } from '../../../utils/constants';
import {
  FiHome,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiPackage,
  FiImage,
  FiUser,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiFileText,
} from 'react-icons/fi';
import type { UserRole } from '../../../types';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  // Buyer items
  {
    path: '/buyer/dashboard',
    label: 'dashboard.buyer.title',
    icon: <FiHome className="w-5 h-5" />,
    roles: ['buyer'],
  },
  {
    path: '/buyer/orders',
    label: 'dashboard.orders',
    icon: <FiShoppingBag className="w-5 h-5" />,
    roles: ['buyer'],
  },
  {
    path: '/buyer/commissions',
    label: 'dashboard.commissions',
    icon: <FiFileText className="w-5 h-5" />,
    roles: ['buyer'],
  },
  // Artist items
  {
    path: '/artist/dashboard',
    label: 'dashboard.artist.title',
    icon: <FiHome className="w-5 h-5" />,
    roles: ['artist'],
  },
  {
    path: '/artist/artworks',
    label: 'dashboard.myArtworks',
    icon: <FiImage className="w-5 h-5" />,
    roles: ['artist'],
  },
  {
    path: '/artist/orders',
    label: 'dashboard.orders',
    icon: <FiPackage className="w-5 h-5" />,
    roles: ['artist'],
  },
  {
    path: '/artist/commissions',
    label: 'dashboard.commissions',
    icon: <FiFileText className="w-5 h-5" />,
    roles: ['artist'],
  },
  {
    path: '/artist/profile',
    label: 'dashboard.artistProfile',
    icon: <FiUser className="w-5 h-5" />,
    roles: ['artist'],
  },
  // Admin items
  {
    path: '/admin/dashboard',
    label: 'dashboard.admin.title',
    icon: <FiHome className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/admin/users',
    label: 'dashboard.users',
    icon: <FiUsers className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/admin/artists',
    label: 'dashboard.artists',
    icon: <FiUser className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/admin/artworks',
    label: 'dashboard.artworks',
    icon: <FiImage className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/admin/metrics',
    label: 'dashboard.metrics',
    icon: <FiBarChart2 className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/admin/settings',
    label: 'dashboard.settings',
    icon: <FiSettings className="w-5 h-5" />,
    roles: ['admin'],
  },
];

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen: controlledIsOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isMobileOpen;
  const setIsOpen = onClose ? () => onClose() : setIsMobileOpen;

  if (!user) {
    return null;
  }

  const userRole = user.role;
  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole));

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleItemClick = () => {
    // Close mobile menu when item is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 hover:text-primary-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            {APP_NAME}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleItemClick}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors
                      ${
                        active
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }
                    `}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{t(item.label) || item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <Link
            to="/"
            className="block w-full text-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            onClick={handleItemClick}
          >
            {t('dashboard.backToHome') || 'Volver al inicio'}
          </Link>
        </div>
      </aside>
    </>
  );
};
