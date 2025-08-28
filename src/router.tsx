import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>

                <Route index element={<Navigate to="home" replace />} />
                <Route path="home">
                    <Route index element={<LandingPage />} />
                </Route>
            
            </Route>
            <Route path='*' element={<Navigate to={"/"} replace />} />
        </Routes>
    );
};

export default AppRoutes;