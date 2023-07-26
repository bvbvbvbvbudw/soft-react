// import routes and react
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import components
import Home from './Home';
import Welcome from "./Welcome";
import Project from './Project';
import BackLog from './BackLog';
import BackLogPage from './BackLogPage';
import Board from './Board';
import MyProfile from "./MyProfile";
import About from "./About";
import Contact from "./Contact";
import Feedback from './Feedback'
import Auth from './Auth';


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
                            <Route path="/contacts" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/support" element={<Feedback />} />
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