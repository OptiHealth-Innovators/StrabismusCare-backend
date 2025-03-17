// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { MongoClient, ServerApiVersion } from 'mongodb';
// import bcrypt from 'bcrypt';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3020;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: ServerApiVersion.v1,
// });

// async function run() {
//   try {
//     await client.connect();
//     const database = client.db("strabismusCareBD");
//     const userCollection = database.collection("user");

//     // Register route
//     app.post('/register', async (req, res) => {
//       const { name, email, password } = req.body;

//       try {
//         // Check if the email is already registered
//         const existingUser = await userCollection.findOne({ email });

//         if (existingUser) {
//           return res.status(400).json({ message: "Email is already registered" });
//         }

//         // Encrypt the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const newUser = { name, email, password: hashedPassword };
//         const result = await userCollection.insertOne(newUser);

//         if (result.insertedId) {
//           res.status(201).json({ success: true, message: "User created successfully", userId: result.insertedId });
//         } else {
//           res.status(500).json({ success: false, message: "User creation failed" });
//         }
//       } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ success: false, message: "User creation failed", error: error.message });
//       }
//     });

//     // Login route
//     app.post('/login', async (req, res) => {
//       const { email, password } = req.body;

//       try {
//         const user = await userCollection.findOne({ email });

//         if (!user) {
//           return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//           return res.status(401).json({ success: false, message: "Invalid password" });
//         }

//         res.status(200).json({ success: true, message: "Login successful", userId: user._id });
//       } catch (error) {
//         console.error("Error logging in:", error);
//         res.status(500).json({ success: false, message: "Login failed", error: error.message });
//       }
//     });


//     //here I want to add get all patient data route










//     // Root route
//     app.get("/", (req, res) => {
//       res.send("Hello from BBOOK Server.");
//     });

//     // Start the server after successful DB connection
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });

//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//   }
// }

// run().catch(console.dir);
