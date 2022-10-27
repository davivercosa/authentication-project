import express from 'express';

import HomeController from '../controllers/HomeController';
import LoginController from '../controllers/LoginController';

const router = express.Router();

router.get('/', HomeController.index);

// Login
router.post('/signup', LoginController.signUp);
router.post('/signin', LoginController.signIn);

export { router };
