import twilio from "twilio";
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_ID;
const usePhoneNumber = process.env.PHONENUMBER;
const otpService = {
  sendOTP: (phoneNumber: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(accountSid);
        console.log(verifySid);
        console.log(usePhoneNumber);
        const client = twilio(accountSid, authToken);
        const otp = await client.verify.v2
          .services(verifySid ?? "")
          .verifications.create({ to: `+${usePhoneNumber} `, channel: "sms" });
        console.log(otp);
        resolve(otp);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  verifyOTP: (phoneNumber: string, otp: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const client = twilio(accountSid, authToken);

        const result = await client.verify.v2
          .services(verifySid ?? "")
          .verificationChecks.create({ to: `+${usePhoneNumber}`, code: otp })
          .then((verify_check) => {
            if (verify_check.status == "approved") resolve("approved");
            else reject("");
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
};

export default otpService;
