export interface INotificationService {
  sendTextMessage(data: { number: string; text: string }): Promise<void>;
}