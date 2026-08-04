import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";

describe("SearchableSelectGroup", () => {
  it("keeps the field visible while options are loading", () => {
    render(
      <SearchableSelectGroup
        label="Paciente"
        options={[]}
        value=""
        onChange={vi.fn()}
        placeholder="Buscar paciente pelo nome..."
        isLoading
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Buscar paciente pelo nome...",
    });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows an empty searchable field when there are no results", () => {
    render(
      <SearchableSelectGroup
        label="Médico"
        options={[]}
        value=""
        onChange={vi.fn()}
        placeholder="Buscar médico pelo nome..."
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Buscar médico pelo nome...",
    });
    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
    expect(screen.getByText("Nenhum resultado encontrado")).toBeInTheDocument();
  });
});
