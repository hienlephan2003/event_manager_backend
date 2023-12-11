import Payment from "../models/Payment";
import config from "../config/zalopayConfig";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import {
  PaymentDTO,
  QueryRequest,
  QueryType,
  OrderRequest,
} from "../types/payment.type";
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
        // const newPayment = new Payment(payment);

        const transID = Math.floor(Math.random() * 10000);

        const order: OrderRequest = {
          appid: config.app_id,
          apptransid: `${moment().format("YYMMDD")}_${transID}`,
          appuser: "demo",
          apptime: Date.now(),
          item: JSON.stringify([{}]),
          embeddata: JSON.stringify({
            redirecturl: payment.redirectUrl,
          }),
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
