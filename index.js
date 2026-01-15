const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const PAYSTACK_SECRET = "pk_test_17ac5b31debda9d758b16903e9cad94096d5f120"; // Replace with your Paystack secret key

app.post("/verify", async (req, res) => {
  const { reference, amount } = req.body;

  if (!reference || !amount) return res.status(400).json({ status: "missing-data" });

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const data = response.data.data;

    if (data.status === "success" && data.amount === amount * 100) {
      return res.json({ status: "success" });
    } else {
      return res.json({ status: "failed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
