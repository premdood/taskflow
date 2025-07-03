import { connect } from "mongoose";
import { MONGO } from "../config/config.js";

const connectDB = () => {
  const connectionString = `mongodb+srv://${MONGO.USER}:${MONGO.PASSWORD}@nodeexpressprojects.4vu94.mongodb.net/${MONGO.DATABASE}?retryWrites=true&w=majority&appName=NodeExpressProjects`;
  return connect(connectionString);
};

export default connectDB;
