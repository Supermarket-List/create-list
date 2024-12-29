export const apiBaseUrl = "https://supermarketapp25.pythonanywhere.com";

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

export const excluirLista = async (listaId: number): Promise<void> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/listas/${listaId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta:", errorData);
      throw new Error(errorData.error || "Erro ao excluir a lista.");
    }

    console.log(`Lista ${listaId} excluída com sucesso!`);
  } catch (err) {
    console.error("Erro ao excluir a lista:", err);
    throw err; // Repassa o erro para o handler do front-end
  }
};

export const autenticarUsuario = async (nome: string, telefone: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, telefone }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro no login.");
    }

    return response;
  } catch (error: unknown) {
    // Verificando se o erro é uma instância de Error
    if (error instanceof Error) {
      throw new Error(error.message || "Erro na autenticação.");
    } else {
      throw new Error("Erro desconhecido durante a autenticação.");
    }
  }
};
