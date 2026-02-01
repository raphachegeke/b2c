import axios from "axios";
import Transaction from "../models/Transaction.js";
import { getAccessToken } from "../utils/darajaAuth.js";
import { generateSecurityCredential } from "../utils/encrypt.js";

export const sendB2C = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const token = await getAccessToken();

    const payload = {
      InitiatorName: process.env.B2C_INITIATOR,
      SecurityCredential: generateSecurityCredential(process.env.B2C_PASSWORD),
      CommandID: "BusinessPayment",
      Amount: amount,
      PartyA: process.env.B2C_SHORTCODE,
      PartyB: phone,
      Remarks: "Payout",
      QueueTimeOutURL: process.env.B2C_TIMEOUT_URL,
      ResultURL: process.env.B2C_RESULT_URL,
      Occasion: "Payment",
    };

    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save as pending
    await Transaction.create({ phone, amount, status: "PENDING", response });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleResult = async (req, res) => {
  const data = req.body;

  // Update transaction based on ResultCode
  const status = data.Result.ResultCode === 0 ? "SUCCESS" : "FAILED";

  await Transaction.updateOne(
    { "response.CheckoutRequestID": data.Result.CheckoutRequestID },
    { status, response: data }
  );

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};

export const handleTimeout = (req, res) => {
  console.log("B2C TIMEOUT", req.body);
  res.json({ ResultCode: 0, ResultDesc: "Timeout Received" });
};
