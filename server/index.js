import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Client } = pkg;
import cors from 'cors';
import createServer from "./utils/server.js";
import { moviePopulate } from "./controllers/moviesPopulate.js";
import populateAdmin from "./controllers/populateAdmin.js";

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


    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      // Retrieve the movie count and admin count
      const movie = await client.query(`SELECT COUNT(*) FROM MOVIE`)
      const admin = await client.query(`SELECT COUNT(*) FROM ADMIN`)

      const movieCount = movie.rows[0].count
      const adminCount = admin.rows[0].count

      // Check if the movies have been populated, otherwise populate the database
      if (movieCount === '0'){
        console.log("Populating Movie Database")
        await moviePopulate();
      }
      else{
        console.log("Movies Populated Already")
      }

      if (adminCount === '0'){
        console.log("Adding an default Admin to System")
        await populateAdmin()
      }
      else{
        console.log("Default Admin already added")
      }
    
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
};

main();

export default client;
