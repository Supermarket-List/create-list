import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../Context/UserContext";

interface Item {
  id: number;
  produto: string;
  valor: number;
  quantidade: number;
  supermercado: string;
}

const CriarLista: React.FC = () => {
  const { user } = useContext(UserContext);
  const [produto, setProduto] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [supermercado, setSupermercado] = useState<string>("");
  const [itens, setItens] = useState<Item[]>([]);
  const [alertModalShow, setAlertModalShow] = useState<boolean>(true);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [responseModal, setResponseModal] = useState({
    show: false,
    title: "",
    body: "",
    isError: false,
  });

  // Função para capitalizar palavras, incluindo caracteres acentuados
  const capitalizeWords = (str: string): string =>
    str
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());

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
      const numericValue = parseFloat(valor.replace("R$ ", "").replace(",", "."));
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

  const getBrazilDateTimeISO = (): string => {
    const brazilDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Sao_Paulo",
    });
    return new Date(brazilDate).toISOString();
  };

  const handleSalvarLista = () => {
    if (!user) {
      setResponseModal({
        show: true,
        title: "Erro",
        body: "Usuário não autenticado. Faça login novamente.",
        isError: true,
      });
      return;
    }

    const lista = {
      data: getBrazilDateTimeISO(),
      itens,
    };

    const userId = user.id;

    console.log("Dados enviados ao backend:", lista);

    fetch(`https://supermarketapp25.pythonanywhere.com/api/listas?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lista),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao salvar a lista: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setResponseModal({
          show: true,
          title: "Sucesso!",
          body: `Sua lista foi salva com sucesso. ID da lista: ${data.listaId}`,
          isError: false,
        });
        setItens([]);
      })
      .catch((error) => {
        setResponseModal({
          show: true,
          title: "Erro",
          body: "Houve um problema ao salvar a lista. Tente novamente.",
          isError: true,
        });
        console.error("Erro ao salvar a lista:", error);
      });
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
            {item.produto} - R$ {item.valor.toFixed(2).replace(".", ",")} - {" "}
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

      <Modal
        show={responseModal.show}
        onHide={() => setResponseModal({ ...responseModal, show: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>{responseModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{responseModal.body}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={responseModal.isError ? "danger" : "success"}
            onClick={() => setResponseModal({ ...responseModal, show: false })}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CriarLista;
