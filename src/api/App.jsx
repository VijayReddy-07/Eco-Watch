import { Toaster } from "@api/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@api/components/lib/query-client'
import NavigationTracker from '@api/components/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from '@api/components/lib/PageNotFound';
import { AuthProvider, useAuth } from '@api/components/lib/AuthContext';
import UserNotRegisteredError from '@api/components/UserNotRegisteredError';
import PublicLogin from '@api/components/pages/PublicLogin';
import PublicDataSubmission from '@api/components/pages/PublicDataSubmission';
import PublicProfile from '@api/components/pages/PublicProfile';
import PublicNotifications from '@api/components/pages/PublicNotifications';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => {
  const isFullScreenPage = ['Landing', 'CommunityHub'].includes(currentPageName);
  if (isFullScreenPage) return <>{children}</>;
  return Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isPublicAccess } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', zIndex: 9999 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #1e293b', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#475569', fontWeight: '600', fontSize: '16px' }}>Loading application...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Define public routes that don't require authentication
  const isPublicRoute = ['/', '/Landing', '/Dashboard', '/CommunityHub', '/Submit', '/Map', '/Explorer', '/Analytics', '/Notifications', '/Profile', '/PublicLogin', '/PublicDataSubmission', '/PublicProfile', '/PublicNotifications'].includes(location.pathname);

  // Handle authentication errors - but allow public access users
  if (authError && !isPublicRoute && !isPublicAccess) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/PublicLogin" element={<PublicLogin />} />
      <Route path="/PublicDataSubmission" element={
        <LayoutWrapper currentPageName="PublicDataSubmission">
          <PublicDataSubmission />
        </LayoutWrapper>
      } />
      <Route path="/PublicProfile" element={
        <LayoutWrapper currentPageName="PublicProfile">
          <PublicProfile />
        </LayoutWrapper>
      } />
      <Route path="/PublicNotifications" element={
        <LayoutWrapper currentPageName="PublicNotifications">
          <PublicNotifications />
        </LayoutWrapper>
      } />
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
