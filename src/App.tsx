import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CriarLista from "./pages/CriarLista";

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/criar-lista" element={<CriarLista />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
