import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Project from './Project';
import BackLog from './BackLog';
import Board from './Board';
import BackLogPage from './BackLogPage';
import Auth from './Auth';
import Welcome from "./Welcome";
import MyProfile from "./MyProfile";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/welcome" element={<Welcome />} />
                        <>
                            <Route path="/project" element={<Project />} />
                            <Route path="/backlog" element={<BackLog />} />
                            <Route path="/backlog/:projectId" element={<BackLogPage />} />
                            <Route path="/board" element={<Board />} />
                            <Route path="/profile" element={<MyProfile />} />
                        </>
                        <Route
                            path="/auth"
                            element={
                                <Auth
                                    isLoggedIn={isLoggedIn}
                                    setIsLoggedIn={setIsLoggedIn}
                                />
                            }
                        />
                </Routes>
            </BrowserRouter>
        </div>
    );
}