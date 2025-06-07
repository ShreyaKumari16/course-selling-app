const express = require("express")
const mongoose = require("mongoose")

const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");
const { adminRouter } = require("./Routes/admin");

const app = express();
app.use(express.json())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to the database");

        app.listen(3000, () => {
            console.log(" Server is running on http://localhost:3000 ");
        });
    }catch(e){
        console.log("Connection Failed");
    }
}

main();