import { Request, Response } from "express";
import paymentService from "../services/paymentService";
import { PaymentDTO, QueryRequest, QueryType } from "../types/payment.type";
import bookingService from "../services/bookingService";
import axios from "axios";
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
        response.status(200).json(data);
      });
    } catch (err) {
      response.status(500).json(err);
    }
  },
  createPaymentv2: async (req: Request, res: Response) => {
    try {
      await paymentService.paymentv2();
    } catch (err) {}
  },
  verifyPaymentResult: async (request: Request, response: Response) => {
    try {
      paymentService
        .createCallbackQuery(request.body.paymentId, QueryType.createOrder)
        .then((result: any) => {
          const tickets = result.tickets;
          const ids = tickets.map((ticket:any) => ticket._id);
          axios.get(`${process.env.BASE_URL}api/ticket/pdf`, {
            params: {
              ids: ids,
              email:result.booking.receiverEmail
            },
            paramsSerializer: {
              indexes: null,
            }
          });
          response.status(200).json(result);
        });
    } catch (err: any) {
      response.status(500).json(err);
    }
  },
  refundPayment: async (request: Request, response: Response) => {
    try {
      paymentService
        .createPaymentRefund(request.body.bookingId)
        .then((result: any) => {
          response.status(200).json(result);
        });
    } catch (err: any) {
      response.status(500).json(err);
    }
  },
};

export default paymentController;
