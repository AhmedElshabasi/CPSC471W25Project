import express from "express";
import client from "../index.js";
import { authenticateToken } from "../utils/middleware.js";

const ticketRouter = express.Router();

// Create ticket (Regular or Premium)
ticketRouter.post("/", authenticateToken, async (req, res) => {
    const {
      ticketType, // "regular" or "premium"
      purchaseDate,
      reclinerSeat,
      price,
      movieTime,
      theatreLocation,
      auditoriumNumber,
      seatId,
      paymentId,
      cardNumber,
      screenType, // only for premium
      seatType    // only for premium
    } = req.body;
  
    const username = req.user.username;
  
    try {
      // Get customer ID from username
      const userRes = await client.query(
        `SELECT Customer_id FROM CUSTOMER WHERE Username = $1`,
        [username]
      );
  
      if (userRes.rowCount === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const customerId = userRes.rows[0].customer_id;
  
      if (ticketType === "regular") {
        await client.query(
          `INSERT INTO REGULAR 
           (Purchase_date, Recliner_seat, Price, Movie_time, Theatre_location,
            Auditorium_number, Seat_ID, Payment_id, Customer_id, Card_number)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            purchaseDate,
            reclinerSeat,
            price,
            movieTime,
            theatreLocation,
            auditoriumNumber,
            seatId,
            paymentId,
            customerId,
            cardNumber,
          ]
        );
      } else if (ticketType === "premium") {
        await client.query(
          `INSERT INTO PREMIUM 
           (Price, Movie_time, Purchase_date, Screen_type, Seat_type,
            Theatre_location, Auditorium_number, Seat_id, Payment_id, Customer_id, Card_number)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            price,
            movieTime,
            purchaseDate,
            screenType,
            seatType,
            theatreLocation,
            auditoriumNumber,
            seatId,
            paymentId,
            customerId,
            cardNumber,
          ]
        );
      } else {
        return res.status(400).json({ error: "Invalid ticket type." });
      }
  
      res.status(201).json({ message: "Ticket created successfully." });
    } catch (err) {
      console.error("Ticket creation error:", err);
      res.status(500).json({ error: "Failed to create ticket." });
    }
  });  

// Get all tickets for a user
ticketRouter.get("/", authenticateToken, async (req, res) => {
  const username = req.user.username;

  try {
    const userRes = await client.query(
      `SELECT Customer_id FROM CUSTOMER WHERE Username = $1`,
      [username]
    );

    const customerId = userRes.rows[0].customer_id;

    const regularTickets = await client.query(
      `SELECT 'Regular' AS type, * FROM REGULAR WHERE Customer_id = $1`,
      [customerId]
    );

    const premiumTickets = await client.query(
      `SELECT 'Premium' AS type, * FROM PREMIUM WHERE Customer_id = $1`,
      [customerId]
    );

    const allTickets = [...regularTickets.rows, ...premiumTickets.rows];

    res.json(allTickets);
  } catch (err) {
    console.error("Error retrieving tickets:", err);
    res.status(500).json({ error: "Failed to retrieve tickets." });
  }
});

// Update ticket (REGULAR or PREMIUM)
ticketRouter.put("/:ticketId", authenticateToken, async (req, res) => {
    const { ticketId } = req.params;
    const {
      ticketType,
      movieTime,
      seatId,
      reclinerSeat,
      theatreLocation,
      auditoriumNumber,
      screenType,
      seatType
    } = req.body;
  
    if (!ticketType || (ticketType !== "regular" && ticketType !== "premium")) {
      return res.status(400).json({ error: "Valid ticketType (regular or premium) is required." });
    }
  
    try {
      if (ticketType === "regular") {
        const result = await client.query(
          `UPDATE REGULAR
           SET 
             Movie_time = $1,
             Seat_ID = $2,
             Theatre_location = $3,
             Auditorium_number = $4,
             Recliner_seat = $5
           WHERE Ticket_id = $6
           RETURNING *`,
          [movieTime, seatId, theatreLocation, auditoriumNumber, reclinerSeat, ticketId]
        );
  
        if (result.rowCount === 0) {
          return res.status(404).json({ error: "Regular ticket not found or update failed." });
        }
  
      } else if (ticketType === "premium") {
        const result = await client.query(
          `UPDATE PREMIUM
           SET 
             Movie_time = $1,
             Seat_ID = $2,
             Theatre_location = $3,
             Auditorium_number = $4,
             Screen_type = $5,
             Seat_type = $6
           WHERE Ticket_id = $7
           RETURNING *`,
          [movieTime, seatId, theatreLocation, auditoriumNumber, screenType, seatType, ticketId]
        );
  
        if (result.rowCount === 0) {
          return res.status(404).json({ error: "Premium ticket not found or update failed." });
        }
      }
  
      res.json({ message: "Ticket updated successfully." });
    } catch (err) {
      console.error("Ticket update error:", err);
      res.status(500).json({ error: "Failed to update ticket." });
    }
  });
  

// Delete ticket
ticketRouter.delete("/:ticketId", authenticateToken, async (req, res) => {
    const { ticketId } = req.params;
    const { ticketType } = req.body; // client sends ticketType in body
  
    if (!ticketType || (ticketType !== "regular" && ticketType !== "premium")) {
      return res.status(400).json({ error: "Valid ticketType (regular or premium) is required." });
    }
  
    try {
      const table = ticketType === "regular" ? "REGULAR" : "PREMIUM";
  
      const result = await client.query(
        `DELETE FROM ${table} WHERE Ticket_id = $1 RETURNING *`,
        [ticketId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Ticket not found or already deleted." });
      }
  
      res.json({ message: "Ticket deleted successfully." });
    } catch (err) {
      console.error("Ticket deletion error:", err);
      res.status(500).json({ error: "Failed to delete ticket." });
    }
  });
  

export default ticketRouter;
