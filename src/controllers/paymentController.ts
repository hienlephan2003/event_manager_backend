import { Request, Response } from "express";
import paymentService from "../services/paymentService";
import { PaymentDTO, QueryRequest, QueryType } from "../types/payment.type";
const paymentController = {
  createNewPayment: async (request: Request, response: Response) => {
    try {
      const payment: PaymentDTO = {
        userId: request.body.userId ?? "",
        bookingId: request.body.bookingId ?? "",
        amount: request.body.amount ?? 50000,
        embededInfo: request.body.embededInfo ?? "",
      };
      paymentService.createTransaction(payment).then((data) => {
        console.log(data);
        // response.status(200).json(data);
      });
    } catch (err) {
      response.status(500).json(err);
    }
  },
  verifyPaymentResult: async (request: Request, response: Response) => {
    try {
      const query: QueryRequest = {
        userId: request.body.userId,
        appTransId: request.body.appTransId,
        paymentId: request.body.paymentId,
      };
      paymentService
        .createCallbackQuery(query, QueryType.createOrder)
        .then((result: any) => {
          response.status(200).json(result);
        });
    } catch (err) {
      response.status(500).json(err);
    }
  },
};

export default paymentController;
