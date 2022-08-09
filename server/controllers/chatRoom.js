// utils
import makeValidation from '@withvoid/make-validation';
// models
import ChatRoomModel, { CHAT_ROOM_TYPES } from '../models/ChatRoom.js';
import ChatMessageModel from '../models/ChatMessage.js';
import UserModel from '../models/User.js';

export default {
    initiate: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    userIds: {
                        type: types.array,
                        options: { unique: true, empty: false, stringOnly: true }
                    },
                    type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { userIds, type } = req.body;
            const { userId: chatInitiator } = req;
            const allUserIds = [...userIds, chatInitiator];
            const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
            return res.status(200).json({ success: true, chatRoom });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    postMessage: async (req, res) => {
        try {
            const { roomId } = req.params;
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    messageText: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const messagePayload = {
                messageText: req.body.messageText,
            };
            const currentLoggedUser = req.userId;
            const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
            global.io.sockets.in(roomId).emit('new message', { message: post });
            return res.status(200).json({ success: true, post });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    getRecentConversation: async (req, res) => {
        try {
            const currentLoggedUser = req.userId;
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
            const roomIds = rooms.map(room => room._id);
            const recentConversation = await ChatMessageModel.getRecentConversation(
                roomIds, options, currentLoggedUser
            );
            return res.status(200).json({ success: true, conversation: recentConversation });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    getConversationByRoomId: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }
            const users = await UserModel.getUserByIds(room.userIds);
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
            return res.status(200).json({
                success: true,
                conversation,
                users,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    },
    markConversationReadByRoomId: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }

            const currentLoggedUser = req.userId;
            const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    },
    getallchatusers: async (req, res) => {
        try {
            const { userId } = req.body;
            if (!userId) return res.status(400).json({
                success: false,
                message: 'No User Id',
            })
            const otherusers = await UserModel.find({ _id: { $nin: userId } });
            console.log(otherusers);
            let chatmessages = await ChatMessageModel.find({
                "$or": [{
                    toUserId: userId
                }, {
                    fromUserId: userId
                }]
            });
            return res.status(200).json({
                success: true, otherusers,
                chatmessages
            });
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    },
    unreadmessageusers: async (req, res) => {
        try {
            const { userId } = req.body;
            const otherusers = await UserModel.find({ _id: { $nin: userId } });
            let chatmessages = await ChatMessageModel.find({
                "$and": [{
                    toUserId: userId
                }, {
                    readcheck: false
                }]
            });
            return res.status(200).json({
                success: true,
                otherusers,
                chatmessages
            })
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    },
    readmessageusers: async (req, res) => {
        try {
            const { userId } = req.body;
            const otherusers = await UserModel.find({ _id: { $nin: userId } });
            let chatmessages = await ChatMessageModel.find({
                "$and": [{
                    toUserId: userId
                }, {
                    readcheck: true
                }]
            });
            return res.status(200).json({
                success: true,
                otherusers,
                chatmessages
            })
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    },
    getUserConversation: async (req, res) => {
        try {
            const { fromUserId, toUserId } = req.body;
            if (!fromUserId || !toUserId) return res.status(400).json({
                success: false,
                message: 'Somthing Missing',
            })
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            await ChatMessageModel.updateMany({ fromUserId: toUserId },
                {
                    $set: {
                        readcheck: true
                    }
                }
            )
            const conversation = await ChatMessageModel.getConversationByUserId(fromUserId, toUserId);
            global.io.sockets.in(toUserId).emit('join', { message: conversation });
            return res.status(200).json({
                success: true,
                conversation,
            });
        } catch (error) {
            return res.status(500).json({
                success: false, error
            })
        }
    },
    newpostMessage: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    fromUserId: {
                        type: types.string,
                    },
                    toUserId: {
                        type: types.string,
                    },
                    messageText: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });
            const { fromUserId, toUserId, messageText } = req.body;
            const post = await ChatMessageModel.oncreatesave(fromUserId, toUserId, messageText);
            global.io.sockets.in(toUserId).emit('new message', { message: post });
            return res.status(200).json({ success: true, post });
        } catch (error) {
            return res.status(500).json({
                success: false, error

            })
        }
    }
}