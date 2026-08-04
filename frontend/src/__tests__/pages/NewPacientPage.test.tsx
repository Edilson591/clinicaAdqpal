import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NovoPacientePage from "../../pages/patients/NewPacientPage";

const navigate = vi.fn();
const createPatient = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

vi.mock("../../hooks/usePatients", () => ({
  useCreatePatient: () => ({ mutate: createPatient, isPending: false }),
}));

vi.mock("../../hooks/useZodForm", () => ({
  useZodForm: () => ({
    register: vi.fn(),
    handleSubmit: (submit: (data: Record<string, unknown>) => void) =>
      (event: { preventDefault: () => void }) => {
        event.preventDefault();
        submit({
          name: "Maria Silva",
          cpf: "123.456.789-01",
          phone: "(11) 99999-9999",
          email: "maria@email.com",
          gender: "Feminino",
          agreement: "SUS",
          dateOfBirth: null,
        });
      },
    control: {},
    watch: vi.fn(),
    setValue: vi.fn(),
    formState: { errors: {} },
  }),
}));

vi.mock("../../components/Dashboard/Header", () => ({ Header: () => null }));
vi.mock("../../components/ui/DividerForms", () => ({ default: () => null }));
vi.mock("../../components/NewPacient/DadosPessoaisSection", () => ({ DadosPessoaisSection: () => null }));
vi.mock("../../components/NewPacient/ContatoSection", () => ({ ContatoSection: () => null }));
vi.mock("../../components/NewPacient/EnderecoSection", () => ({ EnderecoSection: () => null }));
vi.mock("../../components/NewPacient/InformacoesAdicionais", () => ({ InformacoesAdicionais: () => null }));
vi.mock("../../components/Form/FormHeader", () => ({ FormHeader: () => null }));
vi.mock("../../components/Form/FormContent", () => ({ FormContent: ({ children }: { children: React.ReactNode }) => children }));

describe("NovoPacientePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the backend error and does not navigate", async () => {
    render(<NovoPacientePage />);
    fireEvent.click(screen.getByRole("button", { name: "Salvar Paciente" }));

    expect(createPatient).toHaveBeenCalledTimes(1);
    const options = createPatient.mock.calls[0][1];

    act(() => {
      options.onError({
        isAxiosError: true,
        response: { data: { message: "Já existe um paciente com este e-mail." } },
      });
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Já existe um paciente com este e-mail.",
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
