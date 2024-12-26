import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { autenticarUsuario, cadastrarUsuario } from "./api";

const Home: React.FC = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();

  // Função para capitalizar palavras
  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(capitalizeWords(e.target.value));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "$1 $2-$3");
    }
    setTelefone(inputValue);
  };

  const showResponse = (title: string, message: string, isError = false) => {
    setResponseTitle(title);
    setResponseMessage(message);
    setShowResponseModal(true);
    if (!isError) {
      setTimeout(() => {
        setShowResponseModal(false);
      }, 2000);
    }
  };

  const handleSubmitCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await cadastrarUsuario(nome, telefone, email);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userNome", data.nome);
        showResponse("Sucesso!", `Bem-vindo, ${data.nome}!`);
        setNome("");
        setTelefone("");
        setEmail("");
        navigate("/criarlista");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar usuário.");
      }
    } catch (error: any) {
      showResponse("Erro!", error.message, true);
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await autenticarUsuario(nome, telefone);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userNome", data.nome);
        showResponse("Bem-vindo de volta!", `Olá, ${data.nome}!`);
        navigate("/criarlista");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no login.");
      }
    } catch (error: any) {
      showResponse("Erro!", error.message, true);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Bem-vindo à Lista de Compras!</h2>
      <p className="text-center">
        Gerencie suas listas de compras de forma simples e prática.
      </p>

      {/* Modal Inicial */}
      <Modal
        show={showInitialModal}
        onHide={() => setShowInitialModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Bem-vindo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Você é novo por aqui ou já tem cadastro?</p>
          <Button
            variant="primary"
            className="m-2"
            onClick={() => setShowInitialModal(false)}
          >
            Novo Cadastro
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={() => {
              setShowInitialModal(false);
              setShowLoginModal(true);
            }}
          >
            Fazer Login
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de Login */}
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Fazer Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-3">
              <label htmlFor="loginNome" className="form-label">
                Nome
              </label>
              <input
                type="text"
                id="loginNome"
                className="form-control"
                value={nome}
                onChange={handleNomeChange}
                placeholder="Digite seu nome"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginTelefone" className="form-label">
                Telefone
              </label>
              <input
                type="text"
                id="loginTelefone"
                className="form-control"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="Digite seu telefone"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de Resposta */}
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{responseTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{responseMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResponseModal(false)}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Formulário de Cadastro */}
      <form
        className="w-100 mx-auto mt-4"
        onSubmit={handleSubmitCadastro}
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            className="form-control"
            value={nome}
            onChange={handleNomeChange}
            placeholder="Digite seu nome completo"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            className="form-control"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="Digite seu telefone (ex: 11 91331-1054)"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Salvar Cadastro
        </button>
      </form>
    </div>
  );
};

export default Home;
