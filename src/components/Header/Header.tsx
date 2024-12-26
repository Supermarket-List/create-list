import React from "react";
import { Link } from "react-router-dom";
import ShoppingIcon from "../../assets/img/shopping-cart.png"; // Ícone
import styles from "./Header.module.css"; // CSS Module

const Header = () => {
  return (
    <header className="bg-primary text-white p-3">
      <div
        className={`container d-flex justify-content-between align-items-center ${styles.headerContainer}`}
      >
        {/* Ícone e título */}
        <div className="d-flex align-items-center">
          <img
            src={ShoppingIcon}
            alt="Ícone de Compras"
            style={{ width: "30px", height: "30px", marginRight: "10px" }}
          />
          <h1 className="m-0">Lista de Compras</h1>
        </div>

        {/* Navegação */}
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/criarlista" className="nav-link text-white">
                Criar Lista
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Listar" className="nav-link text-white">
                Consultar Lista
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/apagar" className="nav-link text-white">
                Apagar Lista
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
