import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import FarmForm from './components/FarmForm';
import Dashboard from './components/Dashboard';

function App() {
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        return token ? children : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <FarmForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
