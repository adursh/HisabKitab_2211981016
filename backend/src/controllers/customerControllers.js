const customerModel = require("../models/customerModel");
const recordModel = require("../models/recordModel");
const userModel = require("../models/userModel");

const fetchUser = async (req, res) => {
  const { myId, userId } = req.user;
  try {
    const user = await userModel.findById(myId, { password: 0 }).populate({ path: "customers", options: { sort: { date: -1 } } });
    const records = await Promise.all(
      user.customers.map(async (customerId) => {
        return await recordModel.findOne({ $or: [{ userId, customerId }, { userId: customerId, customerId: userId }] }).populate({ path: "lastTransact" });
      })
    );
    res.status(200).json({ user, records });
  } catch (err) { res.status(500).json({ message: "Server error!" }); }
};

const addCustomer = async (req, res) => {
  const { name, phone, contactType } = req.body;
  const { userId, myId } = req.user;
  try {
    let customer;
    if (phone) customer = await userModel.findOne({ phone }, { userId: 1, customers: 1 });
    if (customer) {
      customer.customers.push(userId);
      await customer.save();
      await userModel.findByIdAndUpdate(myId, { $push: { customers: customer.userId } });
      await recordModel.create({ userId, customerId: customer.userId, totalAmount: 0, lastTransact: null });
    } else {
      customer = await customerModel.create({ name, phone });
      await userModel.findByIdAndUpdate(myId, { $push: { customers: customer._id } });
      await recordModel.create({ userId, customerId: customer._id, totalAmount: 0, lastTransact: null });
    }
    res.status(201).json({ message: "Contact added successfully!" });
  } catch (err) { res.status(500).json({ message: "Something went wrong!" }); }
};

const renameCustomer = async (req, res) => {
  const { customerId, name } = req.body;
  const { myId } = req.user;
  try {
    const user = await userModel.findById(myId);
    const hasCustomer = user.customers.some(c => c.toString() === customerId);
    if (!hasCustomer) return res.status(403).json({ message: "Not authorized!" });
    await customerModel.findByIdAndUpdate(customerId, { name });
    res.status(200).json({ message: "Name updated!" });
  } catch (err) { res.status(500).json({ message: "Server error!" }); }
};

const updateProfile = async (req, res) => {
  const { myId } = req.user;
  const { name, shopName } = req.body;
  try {
    await userModel.findByIdAndUpdate(myId, { name, shopName });
    res.status(200).json({ message: "Profile updated!" });
  } catch (err) { res.status(500).json({ message: "Server error!" }); }
};

module.exports = { addCustomer, fetchUser, renameCustomer, updateProfile };
