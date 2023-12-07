const ZaloPayConfig = {
  app_id: "553",
  key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  createorder: "https://sandbox.zalopay.com.vn/v001/tpe/createorder",
  queryorder: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
  bankcode: "zalopayapp",
  callbackurl:
    "https://ldgecfuqlicdeuqijmbr.supabase.co/functions/v1/callback-order",
};

export default ZaloPayConfig;
