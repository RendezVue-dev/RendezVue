import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import EventsPage from './pages/EventsPage';
import GroupsPage from './pages/GroupsPage';
import MatchesPage from './pages/MatchesPage';
import MatchInsightsPage from './pages/MatchInsightsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/events" element={<EventsPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/groups" element={<GroupsPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/matches" element={<MatchesPage />} />
            </Route>
            <Route path="/insights" element={<MatchInsightsPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
