import { json, Router } from "express";

import admin from "./admin";
import auth from "./auth/auth";
import customer from "./customer";
import media from "./media";

const v1 = Router();

v1.use('/admin', json({ limit: '15mb' }), admin);
v1.use('/user', json({ limit: '15mb' }), auth)
v1.use('/customer', customer)
v1.use('/media', json({ limit: '15mb' }), media);

export default v1;