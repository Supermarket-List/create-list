import React, { useState, useEffect, useContext } from "react";
import { excluirLista, obterListasPorUsuario } from "./api"; // Importando funções do api.ts
import { UserContext } from "../Context/UserContext"; // Importando o contexto
import { useNavigate } from "react-router-dom"; // Usando o hook para navegação

interface Item {
    id: number;
    produto: string;
    valor: number;
    quantidade: number;
    supermercado: string;
}

interface Lista {
    id: number;
    userId: number;
    userNome: string | null;
    data: string;
    itens: Item[];
}

const Listar: React.FC = () => {
    const { user } = useContext(UserContext); // Usando o contexto de usuário para acessar o userId
    const [listas, setListas] = useState<Lista[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false); // Estado para controlar o modal
    const navigate = useNavigate(); // Usando o hook para navegação

    // Verifica se o usuário está logado e tem um userId
    const userId = user ? user.id : null;

    useEffect(() => {
        if (!userId) {
            setError("Usuário não logado.");
            setLoading(false);
            return;
        }

        const fetchListas = async () => {
            try {
                const response = await obterListasPorUsuario(Number(userId));
                setListas(response);
            } catch (err) {
                setError("Erro ao carregar listas.");
            } finally {
                setLoading(false);
            }
        };

        fetchListas();
    }, [userId]);

    useEffect(() => {
        // Exibir o modal após 5 segundos de carregamento
        if (!loading) {
            const timer = setTimeout(() => {
                setShowModal(true); // Mostrar o modal após 5 segundos
            }, 5000); // 5000ms = 5 segundos

            return () => clearTimeout(timer); // Limpar o timeout quando o componente for desmontado
        }
    }, [loading]);

    const handleExcluir = async (listaId: number) => {
        try {
            await excluirLista(listaId);
            setListas((prevListas) => prevListas.filter((lista) => lista.id !== listaId));
        } catch (err) {
            setError("Erro ao excluir a lista.");
            console.error("Erro ao excluir a lista:", err);
        }
    };

    const calcularTotalLista = (itens: Item[]): string => {
        const total = itens.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
        return `R$ ${total.toFixed(2).replace(".", ",")}`;
    };

    const handleCriarLista = () => {
        navigate("/CriarLista"); // Redireciona para o componente "Criar Lista"
    };

    const handleCloseModal = () => {
        setShowModal(false); // Fecha o modal ao clicar no botão "X" ou fora do modal
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Listas de Compras</h1>
            {listas.length === 0 ? (
                <p>Não há listas disponíveis para este usuário.</p>
            ) : (
                <ul className="list-group mt-3 w-75">
                    {listas.map((lista) => (
                        <li
                            key={lista.id}
                            className="list-group-item d-flex justify-content-between align-items-start flex-column"
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>{`Lista de ${lista.userNome} - ${new Date(lista.data).toLocaleDateString()}`}</h2>
                                <span
                                    onClick={() => handleExcluir(lista.id)}
                                    style={{ cursor: "pointer", color: "red" }}
                                >
                                    🗑️
                                </span>
                            </div>
                            <p><strong>Total da Lista:</strong> {calcularTotalLista(lista.itens)}</p>
                            <ul>
                                {lista.itens.map((item) => (
                                    <li key={item.id}>
                                        {item.produto} - R$ {item.valor.toFixed(2).replace(".", ",")} -{" "}
                                        {item.quantidade} unidades - (Supermercado) {item.supermercado}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal Bootstrap */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                    onClick={handleCloseModal} // Fecha ao clicar fora do modal
                >
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ótimo!</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal} // Fecha o modal ao clicar no "X"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Essas são suas listas! Clique em "Criar Nova Lista" se deseja criar mais uma lista.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCriarLista}
                                >
                                    Criar Nova Lista
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Listar;
