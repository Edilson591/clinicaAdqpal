// Tipo global injetado pelo CDN do Pluggy Connect Widget
// https://cdn.pluggy.ai/pluggy-connect/v2.2.0/pluggy-connect.js

interface PluggyConnectOptions {
  connectToken: string;
  onSuccess?: (data: { item: { id: string } }) => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
}

interface PluggyConnectInstance {
  init(): void;
  destroy(): void;
}

declare class PluggyConnect implements PluggyConnectInstance {
  constructor(options: PluggyConnectOptions);
  init(): void;
  destroy(): void;
}

interface Window {
  PluggyConnect: typeof PluggyConnect;
}
