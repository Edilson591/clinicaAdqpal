import axios from "axios";
import { DomainError } from "../../domain/errors/DomainError";
import { WhatsAppService } from "../../infrastructure/services/WhatsAppService";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

describe("WhatsAppService", () => {
  beforeEach(() => {
    process.env.EVOLUTION_API_URL = "https://evolution.example.com";
    process.env.EVOLUTION_API_KEY = "test-api-key";
    process.env.EVOLUTION_INSTANCE = "clinica";
    mockedAxios.post.mockReset();
  });

  it.each([
    ["(82) 99999-1234", "5582999991234"],
    ["+55 (82) 99999-1234", "5582999991234"],
    ["082999991234", "5582999991234"],
  ])("normalizes Brazilian phone %s", (phone, expected) => {
    expect(WhatsAppService.normalizePhone(phone)).toBe(expected);
  });

  it("rejects an invalid phone before calling Evolution API", async () => {
    const service = new WhatsAppService();

    await expect(
      service.sendTextMessage({ number: "123", text: "Mensagem" }),
    ).rejects.toBeInstanceOf(DomainError);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it("sends the Evolution API 2.3 payload", async () => {
    mockedAxios.post.mockResolvedValue({ data: { key: { id: "message-1" } } });
    const service = new WhatsAppService();

    await service.sendTextMessage({
      number: "(82) 99999-1234",
      text: "Mensagem de teste",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://evolution.example.com/message/sendText/clinica",
      {
        number: "5582999991234",
        text: "Mensagem de teste",
        delay: 1200,
        linkPreview: false,
      },
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "test-api-key" }),
        timeout: 15_000,
      }),
    );
  });
});
