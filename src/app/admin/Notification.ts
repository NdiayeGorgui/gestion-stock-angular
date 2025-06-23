export interface Notification {
  id: number;
  message: string;
  username:string;
  readValue: boolean;
  archived: boolean;
  type: string;
  productKey: string;

}
