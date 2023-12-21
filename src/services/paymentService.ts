import Payment from "../models/Payment";
import config from "../config/zalopayConfig";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import qs from "qs";
import {
  PaymentDTO,
  QueryRequest,
  QueryType,
  OrderRequest,
} from "../types/payment.type";
import bookingService from "./bookingService";
import ticketService from "./ticketService";
import { ConnectionStates } from "mongoose";
import { response } from "express";
import showtimeService from "./showTimeService";
import { logger } from "../utils/logger";
const paymentService = {
  paymentv2: async () => {
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };

    const embed_data = {};

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "zalopayapp",
      mac: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    axios
      .post(config.endpoint, null, { params: order })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  },
  createTransaction: async (payment: PaymentDTO) => {
    return new Promise(async (resolve, reject) => {
      try {
        const transID = Math.floor(Math.random() * 10000);
        //tao zalopay order
        const order: OrderRequest = {
          appid: config.app_id,
          apptransid: `${moment().format("YYMMDD")}_${transID}`,
          appuser: "demo",
          apptime: Date.now(),
          item: JSON.stringify([{}]),
          embeddata: JSON.stringify({
            redirecturl: "",
          }),
          amount: payment.amount,
          description: payment.embededInfo,
          mac: "",
          bankcode: "zalopayapp",
        };
        //them payment vao db
        const newPayment = new Payment({
          bookingId: payment.bookingId,
          embededInfo: payment.embededInfo,
          amount: payment.amount,
          zaloTransactionId: order.apptransid,
        });
        newPayment.save();
        console.log("payment created");
        order.embeddata = JSON.stringify({
          redirecturl: `http://localhost:3000/bookingResult/${newPayment._id}/`,
        });
        //tao macid
        const data1 =
          config.app_id +
          "|" +
          order.apptransid +
          "|" +
          order.appuser +
          "|" +
          payment.amount +
          "|" +
          order.apptime +
          "|" +
          order.embeddata +
          "|" +
          order.item;
        order.mac = CryptoJS.HmacSHA256(data1, config.key1).toString();
        console.log("order" + JSON.stringify(order));
        axios
          .post(config.createorder, null, { params: order })
          .then((result) => {
            resolve(result.data);
          })
          .catch((err) => reject(err));
      } catch (error) {
        logger.error(new Error(error as string));
        reject(error);
      }
    });
  },
  createCallbackQuery: async (paymentId: string, typeQuery: QueryType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const payment = await Payment.findById(paymentId).populate("bookingId");

        const postData = {
          appid: config.app_id,
          apptransid: payment?.zaloTransactionId ?? "",
          mac: "",
        };

        const data =
          postData.appid + "|" + postData.apptransid + "|" + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        const params = new URLSearchParams();
        params.append("appid", postData.appid);
        params.append("apptransid", postData.apptransid);
        params.append("mac", postData.mac);
        console.log(postData);

        let postConfig = {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: params,
          url: config.queryorder,
        };
        console.log(postConfig);

        axios(postConfig)
          .then(async function (response) {
            const res = response.data;
            if (res.returncode == 1) {
              const tickets = await ticketService.getTicketsByBookingId(
                (payment as any).bookingId
              );
              const booking: any = await bookingService.getBookingById(
                payment?.bookingId
              );
              //create permanent booking
              const eventKeyId: any =
                await showtimeService.getEventKeyOfShowtime(booking.showTime);
              console.log("get event key id" + eventKeyId);
              const seatNames: any =
                await bookingService.getSeatNamesByBookingId(
                  payment?.bookingId
                );
              console.log("seatNames");
              logger.info(seatNames);
              const updatedPayment = await Payment.findByIdAndUpdate(
                payment?._id,
                { status: "success" },
                { new: true }
              );
              if (payment?.status == "pending") {
                console.log("going to seat io" + payment.status);
                await bookingService.createPermanentBooking(
                  seatNames,
                  eventKeyId,
                  booking.bookingToken
                );
              }
              resolve({
                paymentStatus: "success",
                payment: updatedPayment,
                booking: booking,
                tickets,
              });
            } else {
              const updatedPayment = await Payment.findByIdAndUpdate(
                payment?._id,
                { status: "failed" },
                { new: true }
              );
              resolve({ paymentStatus: "failed", payment: updatedPayment });
            }
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        logger.error(new Error(error as string));
        reject(error);
      }
    });
  },
  getPaymentById: async (paymentId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const payment = await Payment.findById(paymentId);
        resolve(payment);
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default paymentService;
