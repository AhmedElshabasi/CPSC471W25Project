import dotenv from "dotenv";

dotenv.config()

const ADMIN_ID = process.env.ADMIN_ID
const ROLE = process.env.ROLE
const PERMISSIONS = process.env.PERMISSIONS
const USERNAME = process.env.USERNAME
const PHONE_NUMBER = process.env.PHONE_NUMBER
const PASSWORD = process.env.PASSWORD

const populateAdmin = async () => {
  try{
    const res = await fetch("http://localhost:3001/api/admin/add/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_id: parseInt(ADMIN_ID),
        username: USERNAME,
        password: PASSWORD,
        phone: PHONE_NUMBER,
        role: ROLE,
        permissions: PERMISSIONS,
      }),
    });
    if (!res.ok) {
      console.error("Failed to populate admin:", await res.text());
    }
    console.log("Default Admin Added")

  }
  catch(error){
    console.error(error)
    
  }

}

export default populateAdmin