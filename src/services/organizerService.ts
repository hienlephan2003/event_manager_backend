import Address from "../models/Address";
import Organizer from "../models/Organizer";

const organizerService = {
  createNewOrganizer: (organizer: Object, managerId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existOrganizer = await Organizer.findOne({
          managedBy: managerId,
        });
        //update if exists
        if (existOrganizer != null) {
          await Address.findByIdAndUpdate((existOrganizer as any).address, {
            ...organizer,
          });
          const updateOrganizer = await Organizer.findByIdAndUpdate(
            (existOrganizer as any)._id,
            { ...organizer },
            { new: true }
          ).populate("address");
          resolve(updateOrganizer);
        } else {
          const newAddress = await Address.create({ ...organizer });
          console.log(newAddress);
          const newOrganizer = await Organizer.create({
            ...organizer,
            managedBy: managerId,
            address: (newAddress as any)._id,
          });
          resolve(newOrganizer);
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  updateOrganizer: (organizer: Object) => {
    return new Promise(async (resolve, reject) => {
      try {
        // const updateOrganizer = await Organizer.findByIdAndUpdate(
        //     req.params.id, {
        //         $set: req.body,
        //     }, {new: true}
        // )
        // const { __v, createdAt, updatedAt, ...others} = updateOrganizer._doc;
        // resolve(others);
      } catch (e) {
        reject(e);
      }
    });
  },
  getListOrganizer: (userId: String) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allOrganizer = await Organizer.find({
          managedBy: userId,
        })
          .sort({ createdAt: -1 })
          .exec();
        resolve(allOrganizer);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default organizerService;
