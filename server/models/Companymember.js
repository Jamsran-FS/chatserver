import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const companymemberSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        CompanyName: String,
        CompanyCode: String,
        ParticipationUserCode: String,
        Storage: String,
        Spaceforuse: String,
        CompanyMaster: String,
    },
    {
        timestamps: true,
        collection: "companymembers",
    }
);


export default mongoose.model("CompanyMember", companymemberSchema);
