// App.js
import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
// import Main from "./pages/Main";
import { RecoilRoot, useRecoilState } from "recoil";
import TestHeader from "./pages/TestHeader";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
function App() {
  return (
    <RecoilRoot>
      <div id="App">
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/*<Route path="/api-test" element={<APITest />} />*/}
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </div>
    </RecoilRoot>
  );
}

export default App;
