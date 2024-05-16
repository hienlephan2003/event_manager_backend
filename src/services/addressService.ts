import Address from "../models/Address";

const addressService = {
createNewAddress : (address:Object) => {
    return new Promise(async (resolve, reject) => {
        try{
            const newAddress = new Address(address);
            const saveAddress = await newAddress.save();
            // const { __v, createdAt, updatedAt, ...newAddressInfo } = saveAddress._doc;
            // resolve(newAddressInfo);
        }
        catch(e){
            reject(e);
        }
    })
}
} 
export default addressService
