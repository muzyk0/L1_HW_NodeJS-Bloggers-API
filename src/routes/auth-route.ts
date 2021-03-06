import express from 'express';
import { ioc } from '../ioCController';
import { checkLimitsMiddleware } from '../middlewares/checkLimitsMiddleware';

export const authRoute = express.Router();

authRoute
    .post(
        '/login',
        checkLimitsMiddleware,
        ioc.authController.login.bind(ioc.authController)
    )
    .post(
        '/registration',
        checkLimitsMiddleware,
        ioc.usersController.createNewUser.bind(ioc.usersController)
    )
    .post(
        '/registration-confirmation',
        checkLimitsMiddleware,
        ioc.authController.confirmAccount.bind(ioc.authController)
    )
    .post(
        '/registration-email-resending',
        checkLimitsMiddleware,
        ioc.authController.resendConfirmationCode.bind(ioc.authController)
    );
