import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const companyworkspaceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        CompanyName: String,
        CompanyCode: String,
        UserCode: String,
        Numberofparticipants: String,
        RecentMessageCode: String,
    },
    {
        timestamps: true,
        collection: "companyworkspaces",
    }
);


export default mongoose.model("Companyworkspace", companyworkspaceSchema);
