import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@mycluster.knqyw.mongodb.net/?retryWrites=true&w=majority&appName=myCluster`);

    // Initially log the connection state
    console.log(getConnectionState(mongoose.connection.readyState));

    // Add event listeners for connection state changes
    mongoose.connection.on('connected', () => {
      console.log(getConnectionState(mongoose.connection.readyState));
    });

    mongoose.connection.on('disconnected', () => {
      console.log(getConnectionState(mongoose.connection.readyState));
    });

    mongoose.connection.on('reconnected', () => {
      console.log(getConnectionState(mongoose.connection.readyState));
    });

    mongoose.connection.on('connecting', () => {
      console.log(getConnectionState(mongoose.connection.readyState));
    });

    mongoose.connection.on('disconnecting', () => {
      console.log(getConnectionState(mongoose.connection.readyState));
    });

    mongoose.connection.on('error', (error) => {
      console.error('Mongoose connection error:', error);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Helper function to return the connection state
const getConnectionState = (state: number) => {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    case 99:
      return 'uninitialized';
    default:
      return 'unknown state';
  }
};

export default connectToDb;
