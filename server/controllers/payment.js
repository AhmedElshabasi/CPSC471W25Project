import express from "express";
import client from "../index.js";
import { authenticateToken } from "../utils/middleware.js";

const paymentRouter = express.Router();

// Create a new payment (Card or Paypal)
paymentRouter.post("/", authenticateToken, async (req, res) => {
  const { method, card, paypal, ticketId, status, cardNumber } = req.body;
  const username = req.user.username;

  try {
    // Get customer_id from DB using username
    const userResult = await client.query(
      `SELECT Customer_id FROM CUSTOMER WHERE Username = $1`,
      [username]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const customerId = userResult.rows[0].customer_id;

    // Check for existing card
    const existing = await client.query(
        `SELECT * FROM PAYMENT WHERE Customer_id = $1 AND Card_number = $2`,
        [customerId, cardNumber]
    );
    
    if (existing.rowCount > 0) {
        return res.status(409).json({ error: "This card already exists for your account." });
    }
    const result = await client.query(
      `INSERT INTO PAYMENT (Card_number, Ticket_id, Customer_id, Status, Date)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING Payment_id`,
      [cardNumber, ticketId || null, customerId, status]
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
        [paymentId, email_address, password, phone_number || null]
      );
    }

    res.status(201).json({ message: "Payment created successfully", paymentId });
  } catch (err) {
    console.error("Create payment error:", err.stack);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

paymentRouter.get("/", authenticateToken, async (req, res) => {
    const username = req.user.username;
  
    try {
      // Get customer_id using username
      const userResult = await client.query(
        `SELECT Customer_id FROM CUSTOMER WHERE Username = $1`,
        [username]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const customerId = userResult.rows[0].customer_id;
  
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
      console.error("Get payments error:", err.stack);
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