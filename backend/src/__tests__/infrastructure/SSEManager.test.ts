import { sseManager } from "../../infrastructure/sse/SSEManager";
import type { Response } from "express";

function makeRes(): jest.Mocked<Response> {
  return { write: jest.fn() } as unknown as jest.Mocked<Response>;
}

describe("SSEManager", () => {
  afterEach(() => {
    // limpa clientes entre testes
    (sseManager as any).clients.clear();
  });

  it("starts with zero clients", () => {
    expect(sseManager.clientCount).toBe(0);
  });

  it("addClient registers a client", () => {
    const res = makeRes();
    sseManager.addClient(res);
    expect(sseManager.clientCount).toBe(1);
  });

  it("removeClient unregisters a client", () => {
    const res = makeRes();
    sseManager.addClient(res);
    sseManager.removeClient(res);
    expect(sseManager.clientCount).toBe(0);
  });

  it("broadcast writes correct SSE payload to all clients", () => {
    const res1 = makeRes();
    const res2 = makeRes();
    sseManager.addClient(res1);
    sseManager.addClient(res2);

    sseManager.broadcast("appointment_created", { id: "123" });

    const expected = `event: appointment_created\ndata: ${JSON.stringify({ id: "123" })}\n\n`;
    expect(res1.write).toHaveBeenCalledWith(expected);
    expect(res2.write).toHaveBeenCalledWith(expected);
  });

  it("broadcast removes a client that throws on write", () => {
    const broken = { write: jest.fn().mockImplementation(() => { throw new Error("broken pipe"); }) } as unknown as Response;
    sseManager.addClient(broken);
    expect(() => sseManager.broadcast("test", {})).not.toThrow();
    expect(sseManager.clientCount).toBe(0);
  });
});
