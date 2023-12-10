import Address from "../models/Address";
import Stage from "../models/Stage";

const stageService = {
  createNewStage: (chartId: string, address: any, organizerId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("address" + address);
        const newAddress = new Address({ ...address });
        newAddress.save();
        const newStage = new Stage({
          chartId,
          addressId: newAddress._id,
          organizerId,
        });
        newStage.save();
        console.log(newStage);
        resolve(newStage);
      } catch (err) {
        reject(err);
      }
    });
  },
};
export default stageService;
