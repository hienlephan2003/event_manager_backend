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
};

export default discountService;
