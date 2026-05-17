import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Courses', icon: BookOpen, path: '/courses' },
  { label: 'My Learning', icon: GraduationCap, path: '/sessions' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const BottomNav = ({ items }) => {
  const location = useLocation();
  const navItems = items || NAV_ITEMS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={label}
              to={path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] transition-colors ${
                isActive 
                  ? 'text-primary-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? 'bg-primary-50' : ''
              }`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${
                isActive ? 'font-semibold' : ''
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
