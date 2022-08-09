import express from 'express';
import { createRequire } from "module";
import { v2 } from '@google-cloud/translate';
const require = createRequire(import.meta.url); // construct the require method
const googleCloudTranslation = require("../config/chatapp.json")
const { Translate } = v2;
const translate = new Translate({
    projectId: 'chatapp-357114',
    credentials: googleCloudTranslation
});

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { text, target } = req.body;
        const result = await translateText(text, target)
        return res.status(200).json({ success: true, result })
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
});

async function translateText(text, target) {
    return await translate.translate(text, target);
}

export default router;