import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "../src/components/Context/UserContext";  // Importe o UserProvider
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import CriarLista from "./components/CriarLista/CriarLista";
import Listar from "./components/Listagem/Listar";  // Supondo que você tenha o Listar.tsx

function App() {
  return (
    <UserProvider> {/* Envolva todo o conteúdo da aplicação com o UserProvider */}
      <Router basename="/app-sepermarket-react">
        <div className="App d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/criarlista" element={<CriarLista />} />
              <Route path="/listar" element={<Listar />} /> {/* Adicionando a rota para Listar */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
