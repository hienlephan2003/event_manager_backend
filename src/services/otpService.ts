import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA62cb6941f6f07e7314efac26f7f777d4";

const otpService = {
  sendOTP: (phoneNumber: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const client = twilio(accountSid, authToken);
        const otp = await client.verify.v2
          .services(verifySid)
          .verifications.create({ to: `+${phoneNumber}`, channel: "sms" });
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
          .services(verifySid)
          .verificationChecks.create({ to: `+${phoneNumber}`, code: otp })
          .then((verify_check) => {
            if (verify_check.status == "approved") resolve("approved");
            else reject("");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default otpService;
