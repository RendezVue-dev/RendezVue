import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
       <nav className="container">
         <ul>
           <li>
             <strong>
               <Link to="/">RendezVue</Link>
             </strong>
           </li>
         </ul>
         <ul>
           <li>
             <Link to="/explore" className={isActive('/explore')}>Explore Hobbies</Link>
           </li>
           <li>
             <Link to="/events" className={isActive('/events')}>Events</Link>
           </li>
          <li>
            <Link to="/groups" className={isActive('/groups')}>Groups</Link>
          </li>
          <li>
            <Link to="/matches" className={isActive('/matches')}>Matches</Link>
          </li>
          <li>
            <Link to="/insights" className={isActive('/insights')}>Insights</Link>
          </li>
           {user ? (
             <>
               <li>
                 <Link to="/profile" className={isActive('/profile')}>Profile</Link>
               </li>
               <li>
                 <a href="#" onClick={handleLogout} className="logout-btn">Logout</a>
               </li>
             </>
           ) : (
             <>
               <li>
                 <Link to="/login" className={isActive('/login')}>Login</Link>
               </li>
               <li>
                 <Link to="/register" className={isActive('/register')}>Register</Link>
               </li>
             </>
           )}
         </ul>
       </nav>
  );
};

export default Navbar;
