export interface INotificationService {
  sendTextMessage(data: { to: string; body: string }): Promise<void>;
}