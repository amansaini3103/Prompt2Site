import {Router } from "express"
import {register} from "    ../controllers/authController.js"

const authRouter = Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout
)
authRouter.get('/me',authMiddleware,me)
export default authRouter;


