import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface Item {
  id: number;
  produto: string;
  valor: number;
  quantidade: number;
  supermercado: string;
}

const CriarLista: React.FC = () => {
  const [produto, setProduto] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [supermercado, setSupermercado] = useState<string>("");
  const [itens, setItens] = useState<Item[]>([]);
  const [alertModalShow, setAlertModalShow] = useState<boolean>(true);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const capitalizeWords = (str: string): string =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleSupermercadoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSupermercado(capitalizeWords(e.target.value));

  const handleProdutoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProduto(capitalizeWords(e.target.value));

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (parseInt(inputValue) / 100).toFixed(2);
    inputValue = inputValue.replace(".", ",");
    setValor(`R$ ${inputValue}`);
  };

  const handleAdicionarItem = () => {
    if (produto && valor && quantidade && supermercado) {
      const numericValue = parseFloat(
        valor.replace("R$ ", "").replace(",", ".")
      );
      const novoItem: Item = {
        id: Date.now(),
        produto,
        valor: numericValue,
        quantidade: parseInt(quantidade),
        supermercado,
      };
      setItens([...itens, novoItem]);
      setProduto("");
      setValor("");
      setQuantidade("");
    }
  };

  const calcularTotalCompra = () =>
    itens
      .reduce((total, item) => total + item.valor * item.quantidade, 0)
      .toFixed(2);

  const handleSalvarLista = () => {
    const lista = {
      userId: 123,
      data: new Date().toISOString(),
      itens,
    };

    console.log("Lista salva:", lista);
    alert("Lista salva com sucesso!");
    setItens([]);
  };

  const handleShowModal = (id: number) => {
    setItemToRemove(id);
    setModalShow(true);
  };

  const handleConfirmarRemocao = () => {
    if (itemToRemove !== null) {
      setItens(itens.filter((item) => item.id !== itemToRemove));
      setModalShow(false);
      setItemToRemove(null);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h2>Criar Lista de Compras</h2>

      <Modal show={alertModalShow} onHide={() => setAlertModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Instruções</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Adicione todos os itens à sua lista antes de clicar em "Salvar".
            Cada clique no botão "Salvar" criará uma nova lista.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setAlertModalShow(false)}>
            Entendi
          </Button>
        </Modal.Footer>
      </Modal>

      <form className="w-75 mt-4">
        <div className="mb-3">
          <label htmlFor="supermercado" className="form-label">
            Nome do Supermercado
          </label>
          <input
            type="text"
            className="form-control"
            id="supermercado"
            value={supermercado}
            onChange={handleSupermercadoChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="produto" className="form-label">
            Descrição do Produto
          </label>
          <input
            type="text"
            className="form-control"
            id="produto"
            value={produto}
            onChange={handleProdutoChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">
            Valor
          </label>
          <input
            type="text"
            className="form-control"
            id="valor"
            value={valor}
            onChange={handleValorChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantidade" className="form-label">
            Quantidade
          </label>
          <input
            type="number"
            className="form-control"
            id="quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>
        <Button className="btn btn-primary mt-3" onClick={handleAdicionarItem}>
          Adicionar Item
        </Button>
      </form>

      <div className="mt-4">
        <h4>Total da Compra: R$ {calcularTotalCompra()}</h4>
      </div>

      <ul className="list-group mt-3 w-75">
        {itens.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.produto} - R$ {item.valor.toFixed(2).replace(".", ",")} -{" "}
            {item.quantidade} unidades - (Supermercado) {item.supermercado}
            <span
              onClick={() => handleShowModal(item.id)}
              style={{ cursor: "pointer", color: "red" }}
            >
              🗑️
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="btn btn-success mt-4"
        onClick={handleSalvarLista}
        disabled={itens.length === 0}
      >
        Salvar Lista
      </Button>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja realmente excluir este item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmarRemocao}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CriarLista;
