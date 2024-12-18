// // src/server.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoutes = require("./src/routes/auth");
// const pageRoutes = require("./src/routes/pages");
// const blogRoutes = require("./src/routes/blogs");

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json()); // Parse JSON bodies

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/pages", pageRoutes);
// app.use("/api/blogs", blogRoutes);


// //Welcome Message Route
// app.get("/", (req, res) => {
//   res.send("Welcome to Ragiji Foundation API!");
// });
// // Database Connection
// const connectDB = async () => {
//   try {
//     // Add error handling to see exactly what's wrong
//     if (!process.env.MONGODB_URI) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }

//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // Connect to database before starting server
// connectDB();

// // Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// ----------------------------------------------

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoutes = require("./src/routes/auth");
// const pageRoutes = require("./src/routes/pages");
// const blogRoutes = require("./src/routes/blogs");
// const createHandler = require('github-webhook-handler');

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json()); // Parse JSON bodies

// // --- Webhook Handler Setup ---
// const webhookHandler = createHandler({ path: '/webhook', secret: 'ragiji-api' });

// // Important: Place this middleware BEFORE other routes 
// app.use(function (req, res, next) {
//   if (req.url.startsWith('/webhook')) {
//     webhookHandler(req, res, function (err) {
//       res.statusCode = 404;
//       res.end('no such location');
//     });
//   } else {
//     next(); // Pass control to the next middleware/route handler
//   }
// });

// webhookHandler.on('error', function (err) {
//   console.error('Webhook Error:', err.message);
// });

// webhookHandler.on('push', function (event) {
//   console.log('Received a push event for %s to %s',
//     event.payload.repository.name,
//     event.payload.ref);

//   // Check if the push is to the main branch
//   if (event.payload.ref === 'refs/heads/main') {
//     console.log('Push event is to main branch');
//     // Run your update script (update.sh) here
//     const { exec } = require('child_process');
//     exec('/home/ubuntu/nodejs_api_ragi/update.sh', (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error executing update script:', err);
//         return;
//       }
//       console.log('Update script output:', stdout);
//     });
//   } else {
//     console.log('Push event is not to main branch, skipping update.sh execution');
//   }
// });
// // --- End Webhook Handler Setup ---

// // Routes (These will be handled AFTER the webhook middleware)
// app.use("/api/auth", authRoutes);
// app.use("/api/pages", pageRoutes);
// app.use("/api/blogs", blogRoutes);

// // Welcome Message Route
// app.get("/", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Welcome to Ragiji Foundation API</title>
//       <style>
//         body {
//           font-family: sans-serif;
//           background-color: #f0f0f0;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//           margin: 0;
//         }
//         h1 {
//           color: #333;
//           font-size: 2.5em;
//           text-align: center;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Welcome to Ragiji Foundation API!</h1>
//     </body>
//     </html>
//   `);
// });

// // Database Connection
// const connectDB = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }

//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // Connect to database before starting server
// connectDB();

// // Server (Now only using a single port)
// const PORT = process.env.PORT || 5000;

// // Start the Express server on the defined port
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//-------------------------------------

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const pageRoutes = require("./src/routes/pages");
const blogRoutes = require("./src/routes/blogs");
const createHandler = require('github-webhook-handler');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON bodies (Important: Add this back!)

// --- Webhook Handler Setup ---
const webhookHandler = createHandler({ path: '/webhook', secret: 'ragiji-api' }); // Secret matches GitHub

// Webhook middleware (Correct placement)
app.use(function (req, res, next) {
  if (req.url.startsWith('/webhook')) {
    webhookHandler(req, res, function (err) {
      res.statusCode = 404;
      res.end('no such location');
    });
  } else {
    next();
  }
});

webhookHandler.on('error', function (err) {
  console.error('Webhook Error:', err.message);
});

webhookHandler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);

  // Check if the push is to the main branch
  if (event.payload.ref === 'refs/heads/main') {
    console.log('Push event is to main branch');
    // Run your update script (update.sh) here
    const { exec } = require('child_process');
    exec('/home/ubuntu/nodejs_api_ragi/update.sh', (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing update script:', err);
        return;
      }
      console.log('Update script output:', stdout);
    });
  } else {
    console.log('Push event is not to main branch, skipping update.sh execution');
  }
});
// --- End Webhook Handler Setup ---

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/blogs", blogRoutes);

// Welcome Message Route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to Ragiji Foundation API</title>
      <style>
        body {
          font-family: sans-serif;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        h1 {
          color: #333;
          font-size: 2.5em;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to Ragiji Foundation API!</h1>
    </body>
    </html>
  `);
});

// Database Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database before starting server
connectDB();

// Server
const PORT = process.env.PORT || 5000;

// Start the Express server on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});