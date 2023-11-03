import Payment from "../models/Payment";
import config from "../config/zalopayConfig";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import { response } from "express";
import {
  PaymentDTO,
  QueryRequest,
  QueryType,
  OrderRequest,
} from "../types/payment.type";
const paymentService = {
  createTransaction: async (payment: PaymentDTO) => {
    return new Promise(async (resolve, reject) => {
      try {
        // const newPayment = new Payment(payment);

        const transID = Math.floor(Math.random() * 1000000);

        const order: OrderRequest = {
          appid: config.app_id,
          apptransid: `${moment().format("YYMMDD")}_${transID}`,
          appuser: payment.userId,
          apptime: Date.now().toString(),
          item: JSON.stringify([{}]),
          embeddata: JSON.stringify([{}]),
          amount: payment.amount,
          description: payment.embededInfo,
          mac: "",
          bankcode: "zalopayapp",
        };
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
          .then((result) => resolve(result.data))
          .catch((err) => reject(err));

        //resolve(payment);
      } catch (error) {
        reject(error);
      }
    });
  },
  createCallbackQuery: async (query: QueryRequest, typeQuery: QueryType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const postData = {
          appid: config.app_id,
          apptransid: query.appTransId,
          mac: "",
        };

        const data =
          postData.appid + "|" + postData.apptransid + "|" + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        let payment = null;
        let postConfig = {
          method: "post",
          url: config.queryorder,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: JSON.stringify(postData),
        };
        axios(postConfig)
          .then(async (resonse: any) => {
            let jsonRes = await resonse.json();
            if (jsonRes?.returncode == 1) {
              payment = Payment.findByIdAndUpdate(query.paymentId, {
                $set: {
                  status: "success",
                },
              });
              resolve({ status: false, payment });
            } else {
              payment = Payment.findByIdAndUpdate(query.paymentId, {
                $set: {
                  status: "failed",
                },
              });
            }
          })
          .catch((err) => reject(err));
        resolve({ status: true, payment });
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default paymentService;
