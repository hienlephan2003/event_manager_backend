import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA7217eaad91ed811368b62e5ee3c949fb";

const otpService = {
  sendOTP: (phoneNumber: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(phoneNumber);
        const client = twilio(accountSid, authToken);
        const otp = await client.verify.v2
          .services(verifySid)
          .verifications.create({ to: `+84978754723 `, channel: "sms" });
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
        console.log(err);
        reject(err);
      }
    });
  },
};

export default otpService;
