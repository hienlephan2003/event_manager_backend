export type PaymentDTO = {
  userId: string;
  bookingId: string;
  amount: number;
  embededInfo: string;
};
export type OrderRequest = {
  appid: String;
  apptransid: String;
  appuser: String;
  apptime: any;
  item: Object;
  embeddata: Object;
  amount: Number;
  description: String;
  bankcode: String;
  mac: String;
};
export type PaymentInfo = {
  transaction: string;
  amount: number;
  returnMessage: string;
};
export type CreateOrderResponse = {
  zptranstoken: string;
  orderurl: string;
  returncode: number;
  returnmessage: string;
  apptransid: string;
  transactionid: string;
  amount: number;
};
export type QueryRequest = {
  userId: string;
  appTransId: string;
  paymentId: string;
};
export type QueryResponse = {
  amount: number;
  userId: string;
  returncode: number;
  postId: string;
  zptransid: string;
  returnmessage: string;
  transactionid: string;
};
export enum QueryType {
  createOrder,
  refundOrder,
}
