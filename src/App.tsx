import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, FileText, Wallet, Settings, LogOut, Menu, X, Terminal } from 'lucide-react';
import { cn } from './lib/utils';
import { AppAuthProvider, useAuth, useUser, SignInButton, SignedIn, SignedOut, UserButton } from './lib/auth';
import Overview from './pages/Overview';
import KeysPage from './pages/KeysPage';
import DocsPage from './pages/DocsPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <AppAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          } />
        </Routes>
      </BrowserRouter>
    </AppAuthProvider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useUser();
  const [balance, setBalance] = React.useState(0);
  const [isSyncing, setIsSyncing] = React.useState(true);

  // Sync user with our database
  React.useEffect(() => {
    if (user) {
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || `${user.id}@promptora.ai`
        })
      })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error('Sync failed: ' + text);
        }
        return fetch(`/api/user/${user.id}`);
      })
      .then(res => res.json())
      .then(data => {
        setBalance(data.wallet || 0);
        setIsSyncing(false);
      })
      .catch(err => {
        console.error('User sync error:', err);
        setIsSyncing(false);
      });
    }
  }, [user]);

  if (isSyncing) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500">Initializing your account...</div>;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Key, label: 'API Keys', path: '/dashboard/keys' },
    { icon: FileText, label: 'Documentation', path: '/dashboard/docs' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
           </div>
           <span className="font-semibold tracking-tight text-white">Promptora</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 bg-black/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex flex-col items-start border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Promptora</h2>
              <p className="text-[10px] text-neutral-500">Unified AI Infrastructure</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 md:py-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                )}
              >
                <item.icon className={cn("w-4 h-4")} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4">
          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Available Credits
            </p>

            <p className="text-2xl font-bold text-white mt-2">
              ${balance.toFixed(2)}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">
                Active
              </span>
            </div>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center gap-3">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border border-white/10" } }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <div className="flex-1 overflow-y-auto">
          <React.Suspense fallback={
            <div className="flex-1 p-8 flex items-center justify-center text-slate-500">
              <div className="animate-pulse flex flex-col items-center">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="keys" element={<KeysPage />} />
              <Route path="docs" element={<DocsPage />} />
            </Routes>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}