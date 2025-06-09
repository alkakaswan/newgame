import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number;
}

const connection:ConnectionObject={};


async function DB():Promise<void> {
    if(connection.isConnected){
        console.log("already connected database")
        return ;
    }
    try {
     const database=   await mongoose.connect(process.env.MONGODB_URI || '')
 connection.isConnected=database.connections[0].readyState;
 console.log("database connected successfully");
    } catch (error) {
        console.log("database connection failed",error)
        process.exit(1);
    }
}

export default DB;