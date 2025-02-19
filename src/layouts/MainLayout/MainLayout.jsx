import React, { Suspense, useState } from 'react';
import { CssBaseline } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="content">
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
    </div>
  );
}
