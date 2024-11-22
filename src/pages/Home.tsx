import React, { useState } from "react";

const Home: React.FC = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(capitalizeWords(e.target.value));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "$1 $2-$3"); // Formata como "11 91331-1054"
    }
    setTelefone(inputValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do usuário:", { nome, telefone, email });
    alert("Cadastro salvo com sucesso!");
  };

  return (
    <div className="container mt-4">
      <div className="text-center">
        <h2 className="mb-4">Bem-vindo à Lista de Compras!</h2>
        <p>Preencha suas informações para salvar suas listas de compras.</p>
      </div>

      <form
        className="w-100 mx-auto"
        onSubmit={handleSubmit}
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
            maxLength={13}
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

      <footer className="mt-4 text-center">
        <p className="text-muted">
          Digite suas informações para guardar suas listas de compras e
          consultar valores futuros de itens em diferentes supermercados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
