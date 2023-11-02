type PaymentDTO = {
  userId: string;
  bookingId: string;
  amount: number;
  embededInfo: string;
};
type OrderRequest = {
  appid: String;
  apptransid: String;
  appuser: String;
  apptime: String;
  item: Object;
  embeddata: Object;
  amount: Number;
  description: String;
  bankcode: String;
  mac: String;
};
type PaymentInfo = {
  transaction: string;
  amount: number;
  returnMessage: string;
};
type CreateOrderResponse = {
  zptranstoken: string;
  orderurl: string;
  returncode: number;
  returnmessage: string;
  apptransid: string;
  transactionid: string;
  amount: number;
};
type QueryRequest = {
  userId: string;
  apptransid: string;
  paymentId: string;
};
type QueryResponse = {
  amount: number;
  userId: string;
  returncode: number;
  postId: string;
  zptransid: string;
  returnmessage: string;
  transactionid: string;
};
enum QueryType {
  createOrder,
  refundOrder,
}
