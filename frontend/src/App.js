import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import SignupPage from "./pages/SignupPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/profile-user" element={<ProfilePage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>

  );
}

export default App;
