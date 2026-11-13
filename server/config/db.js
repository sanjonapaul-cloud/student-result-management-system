
/*import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
*/


/*import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("URI exists:", Boolean(uri));
    console.log("URI protocol:", uri?.split("://")[0]);
    console.log("Contains angle brackets:", /[<>]/.test(uri || ""));
    console.log("Contains whitespace:", /\s/.test(uri || ""));

    const parsedUri = new URL(uri);

    console.log("Hostname:", parsedUri.hostname);
    console.log("Database name:", parsedUri.pathname);

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
*/


import mongoose from "mongoose";
import dns from "node:dns";

// Workaround for the current Windows DNS resolver issue
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
