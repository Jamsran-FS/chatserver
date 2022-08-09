class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, username, userid) {
        var user = {
            id, username, userid
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserbyuserid(userid) {
        return this.users.filter((user) => user.userid === userid)[0];
    }

    getUserList() {
        var users = this.users;
        var namesArr = users.map(user => user.username);
        return namesArr
    }

}

export default new Users();
// module.exports = { Users }