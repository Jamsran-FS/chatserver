
var { Users } = require('./user.js');
describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            username: 'Ash',
            userid: '12312313'
        },
        {
            id: '2',
            username: 'Bill',
            userid: '12562312'
        },
        {
            id: '3',
            username: 'Bob',
            userid: '12316312'
        }]
    });

    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            username: 'Joe',
            userid: '22216312'
        }
        var resUser = users.addUser(user.id, user.username, user.userid);
        console.log(resUser)
        expect(users.users).toEqual([user]);
    });

    it('Should return names for baseball', () => {
        var userList = users.getUserList();
        console.log(userList)
        expect(userList).toEqual(['Ash', 'Bill', 'Bob']);
    });

    it('Should find user', () => {
        var userID = '2';
        var user = users.getUser(userID);
        expect(user.id).toBe(userID);
    });

    it('Should remove user', () => {
        var userID = '1';
        var user = users.removeUser(userID);
        expect(user.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });

});