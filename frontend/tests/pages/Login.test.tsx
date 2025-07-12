import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Login } from "../../src/pages/Login";
import { api } from "../../src/api";

jest.mock("../../src/api", () => ({
  api: {
    post: jest.fn(),
  },
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o input e botão", () => {
    render(<Login />);
    expect(
      screen.getByPlaceholderText("Digite o seu nome:")
    ).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("envia o nome via api ao submeter", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Digite o seu nome:"), {
      target: { value: "Kilmmer" },
    });
    fireEvent.click(screen.getByText("Entrar"));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/login", { name: "Kilmmer" });
    });
  });

  it("mostra alerta de erro se api falhar", async () => {
    window.alert = jest.fn();
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Digite o seu nome:"), {
      target: { value: "Kilmmer" },
    });
    fireEvent.click(screen.getByText("Entrar"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Erro ao fazer login. Tente novamente."
      );
    });
  });

  it("mostra alerta de boas-vindas se login for bem-sucedido", async () => {
    window.alert = jest.fn();
    (api.post as jest.Mock).mockResolvedValueOnce({});
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Digite o seu nome:"), {
      target: { value: "Kilmmer" },
    });
    fireEvent.click(screen.getByText("Entrar"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Olá, Kilmmer!");
    });
  });
});
