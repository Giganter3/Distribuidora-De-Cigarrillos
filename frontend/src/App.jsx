import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout'; // Import the new Layout component
import { Login } from './pages/Login'; // Keep Login for now, as it's a direct route
import PlanDeCuentas from './pages/PlanDeCuentas';
import Asientos from './pages/Asientos';
import ReporteDiario from './pages/ReporteDiario';
import ReporteMayor from './pages/ReporteMayor';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* Use Layout for all authenticated routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<PlanDeCuentas />} />
          <Route path="plan-de-cuentas" element={<PlanDeCuentas />} />
          <Route path="asientos" element={<Asientos />} />
          <Route path="reporte-diario" element={<ReporteDiario />} />
          <Route path="reporte-mayor" element={<ReporteMayor />} />
          <Route path="usuarios" element={<Usuarios />} />
          {/* Add other routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
