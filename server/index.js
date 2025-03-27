import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Client } = pkg;
import cors from 'cors';
import createServer from "./utils/server.js";

const app = createServer();

app.use(cors());
const PORT = process.env.PORT || 3001;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const main = async () => {
  try {
    await client.connect();
    console.log("Connection has been established successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();

export default client;
