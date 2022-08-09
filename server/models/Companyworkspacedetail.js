import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const CompanyworkspacedetailSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        CompanyName: String,
        CompanyCode: String,
        UserCode: String,
        Messagecontents: String,
        sendDate: String,
    },
    {
        timestamps: true,
        collection: "companyworkspacedetails",
    }
);


export default mongoose.model("CompanyworkspaceDetail", CompanyworkspacedetailSchema);
