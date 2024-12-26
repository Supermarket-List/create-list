export const apiBaseUrl = "http://127.0.0.1:5000/";

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

export const obterListasPorUsuario = async (
  userId: number
): Promise<Lista[]> => {
  const response = await fetch(`${apiBaseUrl}/api/listas?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao buscar listas.");
  }

  return response.json();
};

// api.ts

export const excluirLista = async (listaId: number): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/api/listas/${listaId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir a lista.");
  }
};
