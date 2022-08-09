import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
const ConnectedUsers = [];

class WebSockets {
    connection(client) {

        client.on('login', async (userID) => {
            const connectedUser = await User.findOne({ _id: userID }).exec();
            console.log('User ' + connectedUser.UserName + ' connected...');
            ConnectedUsers[client.id] = userID;
            await User.findOneAndUpdate({ _id: userID }, { IsActive: true });
            io.emit('login', { result: userID });
            console.log("All connected users: ", ConnectedUsers);
        });

        client.on('disconnect', async () => {
            const disconnectedUser = await User.findOne({ _id: ConnectedUsers[client.id] }).exec();
            console.log('User ' + disconnectedUser.UserName + ' disconnected...');
            await User.findOneAndUpdate({ _id: ConnectedUsers[client.id] }, { IsActive: false });
            io.emit('logout', { result: disconnectedUser._id });
            delete ConnectedUsers[client.id];
            console.log("All connected users: ", ConnectedUsers);
        });

        client.on('directMessage', async (msg, toUserId, sendDateTime) => {
            io.emit('directMessage', { result: msg, fromUserId: ConnectedUsers[client.id], toUserId: toUserId });
            await ChatMessage.oncreatesave(ConnectedUsers[client.id], toUserId, msg, sendDateTime);
        });
    }
}

export default new WebSockets();