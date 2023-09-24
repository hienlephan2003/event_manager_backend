const Address = require("../models/Address")
exports.createNewAddress = (address) => {
    return new Promise(async (resolve, reject) => {
        try{
            const newAddress = new Address(address);
            const saveAddress = await newAddress.save();
            const { __v, createdAt, updatedAt, ...newAddressInfo } = saveAddress._doc;
            resolve(newAddressInfo);
        }
        catch(e){
            reject(e);
        }
    })
}
