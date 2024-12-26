import React, { useState, useEffect, useContext } from "react";
import { excluirLista, obterListasPorUsuario } from "./api"; // Importando funções do api.ts
import { UserContext } from "../Context/UserContext"; // Importando o contexto

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

    const handleExcluir = async (listaId: number) => {
        try {
            await excluirLista(listaId); // Chama a função para excluir a lista
            setListas(listas.filter((lista) => lista.id !== listaId)); // Atualiza a lista de listas após exclusão
        } catch (err) {
            setError("Erro ao excluir a lista.");
        }
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
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <h2>{`Lista de ${lista.userNome} - ${new Date(lista.data).toLocaleDateString()}`}</h2>
                                <ul>
                                    {lista.itens.map((item) => (
                                        <li
                                            key={item.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            {item.produto} - R$ {item.valor.toFixed(2).replace(".", ",")} -{" "}
                                            {item.quantidade} unidades - (Supermercado) {item.supermercado}
                                            <span
                                                onClick={() => handleExcluir(lista.id)} // Passa a lista.id para a função
                                                style={{ cursor: "pointer", color: "red" }}
                                            >
                                                🗑️
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Listar;
