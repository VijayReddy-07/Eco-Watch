/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Analytics from './components/pages/Analytics';
import Dashboard from './components/pages/Dashboard';
import ExploreData from './components/pages/ExploreData';
import Explorer from './components/pages/Explorer';
import Map from './components/pages/Map';
import Notifications from './components/pages/Notifications';
import Profile from './components/pages/Profile';
import Submit from './components/pages/Submit';
import Landing from './components/pages/Landing';
import CommunityHub from './components/pages/CommunityHub';
import PublicLogin from './components/pages/PublicLogin';
import PublicDataSubmission from './components/pages/PublicDataSubmission';
import PublicProfile from './components/pages/PublicProfile';
import PublicNotifications from './components/pages/PublicNotifications';
import AcousticVault from './components/pages/AcousticVault';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Landing": Landing,
    "CommunityHub": CommunityHub,
    "Analytics": Analytics,
    "Dashboard": Dashboard,
    "ExploreData": ExploreData,
    "Explorer": Explorer,
    "Map": Map,
    "Notifications": Notifications,
    "Profile": Profile,
    "Submit": Submit,
    "PublicLogin": PublicLogin,
    "PublicDataSubmission": PublicDataSubmission,
    "PublicProfile": PublicProfile,
    "PublicNotifications": PublicNotifications,
    "AcousticVault": AcousticVault,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};