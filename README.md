<div align="center">
  <img src="https://github.com/AhmedElshabasi/CPSC471W25Project/blob/main/client/src/assets/Screenshot%202025-04-22%20at%204.07.33%E2%80%AFPM.png?raw=true" alt="SceneBook Screenshot" />
</div>

<hr>

<p align="center">
  <strong>An online booking system that allows users to purchase tickets for any movie theatre available in their location.</strong>
</p>

<p align="center">
  <a href="#keyfeatures">Key Features</a> | 
  <a href="#installation">Installation</a> | 
  <a href="#documentation">Documentation</a> | 
  <a href="#license">License</a>
</p>

<div align="center">
  <img src="https://github.com/AhmedElshabasi/CPSC471W25Project/blob/main/client/src/assets/Screenshot%202025-04-22%20at%204.17.48%E2%80%AFPM.png?raw=true" alt="SceneBook Screenshot 2" />
</div>

---

## Key Features
- Seamlessly book tickets for any movie through the interactive preview menu

- Personalize their experience with selections include: IMAX, 4K ULTRA HD, 3D, and premium and standard seats

- Rate movies and search the latest movies 

- Login to your account to get personalized movie recommendations

- Admins can selectively oversee any movie theaters booking and rating system, making modifications seamlessly


## Installation

To get SceneBook running locally using Docker, follow these steps:

### Prerequisites

- [Docker Desktop](https://www.docker.com/) installed on your machine
- `.env` file (must be obtained from one of the project creators)
- [Node.js](https://nodejs.org/en/download) installed on your machine

### Step 1: Clone the Repository

Start by downloading the project files to your local machine.

```bash
git clone https://github.com/AhmedElshabasi/CPSC471W25Project.git
cd CPSC471W25Project
```

### Step 2: Get the `.env` File

You’ll need a `.env` file containing the required environment variables for the app to function.

>📩 Reach out to one of the maintainers to request this file (nateshoad@gmail.com).
>🚫 **Do not share with unauthorized parties.**

### Step 3: Copy `.env` file into directories
```bash
/CPSC471W25Project/.env
/CPSC471W25Project/server/.env
```

### Step 4: Run Docker Commands

> ⚠️ Make sure Docker Desktop is open and running before executing any Docker commands.

```bash
docker-compose up --build
```
### Step 4: Visit Project in Browser

> Database should be populated with movies and an default admin should be added. Refer to `.env` file for admin details
> Note for authorization purposes, to visit admin dash board visit `http://localhost:5173/admin`

```bash
http://localhost:5173/
```

## Documentation

## License
MIT
