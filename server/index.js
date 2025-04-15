import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Client } = pkg;
import cors from 'cors';
import createServer from "./utils/server.js";
import { moviePopulate } from "./controllers/moviesPopulate.js";

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

    // Retrieve the movie count
    const movie = await client.query(`SELECT COUNT(*) FROM MOVIE`)
    const movieCount = movie.rowCount

    // Check if the movies have been populated, otherwise populate the database
    if (movieCount === 1){
      console.log("Populating Movie Database")
      await moviePopulate();
    }
    else{
      console.log("Movies Populated Already")
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();

export default client;
