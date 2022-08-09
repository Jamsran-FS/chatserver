import express from 'express';
import chatRoom from '../controllers/chatRoom.js';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

router
    .post('/', chatRoom.getallchatusers)
    .post('/getconversation', chatRoom.getUserConversation)
    .post('/message', chatRoom.newpostMessage)
    .get('/unread', chatRoom.unreadmessageusers)
    .get('/read', chatRoom.readmessageusers)
export default router;