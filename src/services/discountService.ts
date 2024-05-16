import Discount from "../models/Discount";
import DiscountUsed from "../models/DiscountUsed";

const discountService = {
  checkDiscountValid: (code: string, showtimeId: string, userId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const discount: any = await Discount.findOne({ showtimeId, code });
        if (!discount) resolve(false);
        if (
          discount.showtimeId != showtimeId ||
          discount.startAt > new Date() ||
          discount.endAt < new Date()
        ) {
          resolve(false);
        }
        const discountId = (discount as any)._id;
        const discountUsed: any = await DiscountUsed.findOne({
          userId,
          discountId,
        });
        if (discountUsed && discountUsed.timeUsed >= discount.maxUsed) {
          resolve(false);
        }
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  },
  applyDiscount: async (
    discountId: string,
    userId: string,
    maxTimeUsed: number
  ) => {
    return new Promise(async (res, rej) => {
      try {
        const discount = await DiscountUsed.findOne({ discountId, userId });
        console.log(discount);
        if (!discount) {
          const newDiscount = await DiscountUsed.create({ discountId, userId });
          return res(true);
        } else {
          if (discount.timeCount <= maxTimeUsed) {
            discount.timeCount += 1;
            await discount.save();
            return res(true);
          } else return res(false);
        }
      } catch (err) {
        rej(err);
      }
    });
  },
};

export default discountService;
