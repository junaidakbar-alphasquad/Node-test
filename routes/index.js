import { Router } from 'express';
import posts from './api/posts.js';
import users from './api/users.js';

const router = Router();
router.get('/posts/:id',posts.getPost);
router.delete('/posts/:id',posts.deletePost);
router.put('/posts/:id',posts.updatePost);
router.post('/posts',posts.postPost);
router.get('/posts',posts.getPosts);
router.post('/posts/delete/many',posts.deleteposts);
router.get('/users/:id',users.getUser);
router.delete('/users/:id',users.deleteUser);
router.put('/users/:id',users.updateUser);
router.put('/users/status/:id',users.deactivateUser);
router.post('/users',users.postUser);
router.get('/users',users.getusers); 
router.post('/users/delete/many',users.deleteusers);
export default router;