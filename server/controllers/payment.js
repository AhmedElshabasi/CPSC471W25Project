import express from "express";
import client from "../index.js";
import { authenticateToken } from "../utils/middleware.js";

const paymentRouter = express.Router();

// Create a new payment (Card or Paypal)
paymentRouter.post("/", authenticateToken, async (req, res) => {
  const { method, card, paypal, ticketId, status, cardNumber } = req.body;
  const customerId = req.user.customer_id;

  if (!method || !ticketId || !cardNumber || typeof status !== "boolean") {
    return res.status(400).json({ error: "Missing required payment fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO PAYMENT (Card_number, Ticket_id, Customer_id, Status, Date)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING Payment_id`,
      [cardNumber, ticketId, customerId, status]
    );

    const paymentId = result.rows[0].payment_id;

    if (method === "card") {
      const { expiration_date, card_type, cvv, card_holder } = card;
      await client.query(
        `INSERT INTO CARD (Payment_id, Expiration_date, Card_type, CVV, Card_holder)
         VALUES ($1, $2, $3, $4, $5)`,
        [paymentId, expiration_date, card_type, cvv, card_holder]
      );
    } else if (method === "paypal") {
      const { email_address, password, phone_number } = paypal;
      await client.query(
        `INSERT INTO PAYPAL (Payment_id, Email_address, Password, Phone_number)
         VALUES ($1, $2, $3, $4)`,
        [paymentId, email_address, password, phone_number]
      );
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    res.status(201).json({ message: "Payment created successfully", paymentId });
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

paymentRouter.get("/", authenticateToken, async (req, res) => {
    const customerId = req.user.customer_id;
  
    try {
      const payments = await client.query(
        `SELECT * FROM PAYMENT WHERE Customer_id = $1`,
        [customerId]
      );
  
      const paymentIds = payments.rows.map(p => p.payment_id);
  
      const cards = await client.query(
        `SELECT * FROM CARD WHERE Payment_id = ANY($1::int[])`,
        [paymentIds]
      );
  
      const paypals = await client.query(
        `SELECT * FROM PAYPAL WHERE Payment_id = ANY($1::int[])`,
        [paymentIds]
      );
  
      res.json({
        payments: payments.rows,
        cards: cards.rows,
        paypals: paypals.rows,
      });
    } catch (err) {
      console.error("Get payments error:", err);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  paymentRouter.delete("/:paymentId", authenticateToken, async (req, res) => {
    const { paymentId } = req.params;
  
    try {
      // delete from PAYPAL or CARD first
      await client.query(`DELETE FROM PAYPAL WHERE Payment_id = $1`, [paymentId]);
      await client.query(`DELETE FROM CARD WHERE Payment_id = $1`, [paymentId]);
  
      // then delete from PAYMENT
      const result = await client.query(
        `DELETE FROM PAYMENT WHERE Payment_id = $1 RETURNING *`,
        [paymentId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }
  
      res.json({ message: "Payment deleted successfully" });
    } catch (err) {
      console.error("Delete payment error:", err);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  });
  
export default paymentRouter;