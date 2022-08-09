import express from 'express';
import user from '../controllers/user.js';

const router = express.Router();

router
    .get('/', user.onGetAllUsers)
    .post('/create', user.onCreateUser)
    .get('/:id', user.onGetUserById)
    .post('/:id', user.onDeleteUserById)
    .delete('/deleteusers', user.onDeleteuserAll)

export default router;