import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="container">
      <small>
        &copy; {new Date().getFullYear()} RendezVue. All rights reserved.
      </small>
    </footer>
  );
};

export default Footer;
