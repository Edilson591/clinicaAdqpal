// =============================================================================
// DOMAIN ERRORS
// Erros tipados para toda a aplicação.
// =============================================================================

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotPermission extends DomainError {
  constructor(message = "usuario") {
    super(`${message} sem permissão`)
    this.name = "NotPermissionUser";
  }
}

export class NotFoundError extends DomainError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado.`, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message = "Conflito com recurso existente.") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Não autorizado.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 422);
    this.name = "ValidationError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Acesso negado.") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}


