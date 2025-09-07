import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'stretch' }}>
      {/* Sidebar placeholder */}
      <div className="sidebar" style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '20px', borderRight: '1px solid #ccc', boxSizing: 'border-box' }}>
        <h2>Menu</h2>
        <nav>
          <ul>
            <li><Link to="/app/plan-de-cuentas" style={{ fontSize: '1.2em' }}>Plan de Cuentas</Link></li>
            <li><Link to="/app/asientos" style={{ fontSize: '1.2em' }}>Asientos</Link></li>
            <li><Link to="/app/reporte-diario" style={{ fontSize: '1.2em' }}>Reporte Diario</Link></li>
            <li><Link to="/app/reporte-mayor" style={{ fontSize: '1.2em' }}>Reporte Mayor</Link></li>
            <li><Link to="/app/usuarios" style={{ fontSize: '1.2em' }}>Usuarios</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', height: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;