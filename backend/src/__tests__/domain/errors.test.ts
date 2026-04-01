import {
  DomainError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/DomainError";

describe("DomainError hierarchy", () => {
  it("DomainError sets message and statusCode", () => {
    const err = new DomainError("algo errado", 400);
    expect(err.message).toBe("algo errado");
    expect(err.statusCode).toBe(400);
    expect(err).toBeInstanceOf(Error);
  });

  it("NotFoundError has status 404 and includes resource name", () => {
    const err = new NotFoundError("Consulta");
    expect(err.statusCode).toBe(404);
    expect(err.message).toMatch(/Consulta/);
  });

  it("ConflictError has status 409", () => {
    const err = new ConflictError("já existe");
    expect(err.statusCode).toBe(409);
  });

  it("UnauthorizedError has status 401", () => {
    const err = new UnauthorizedError("sem permissão");
    expect(err.statusCode).toBe(401);
  });

  it("ValidationError has status 422", () => {
    const err = new ValidationError("campo inválido");
    expect(err.statusCode).toBe(422);
  });
});
