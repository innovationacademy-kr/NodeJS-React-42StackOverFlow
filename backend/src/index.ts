import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { authRouter } from "./routes/auth";
import { postRouter } from "./routes/post";
import { userRouter } from "./routes/user";
import { pageRouter } from "./routes/page";
import { RankService } from "./service/rank_service";
import { UserService } from "./service/user_service";
import { errorMiddleware } from "./middlewares/error.middleware";
import cors from "cors";
import passport from "passport";
import passportConfig from "./passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import schedule from "node-schedule";
import { applicationRouter } from "./routes";

import { insertSeed } from "./entity/seed/seed_data";
import * as Sentry from "@sentry/node";

dotenv.config();

const swaggerSpec = YAML.load(path.join(__dirname, "../build/swagger.yaml"));
const app = express();
if (process.env.NODE_ENV === "production") {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    app.use(Sentry.Handlers.requestHandler());
}

passportConfig();
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://3.36.121.236",
        "http://swim.42seoul.io",
        "https://swim.42seoul.io",
        "https://3.36.121.236",
    ],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(applicationRouter);
if (process.env.NODE_ENV === "production") {
    app.use(Sentry.Handlers.errorHandler());
}
app.use(errorMiddleware);

app.listen(5000, async () => {
    console.log("서버 가동");
    await createConnection();
    console.log("DB 연결");
    const monthRankReset = schedule.scheduleJob('00 00 00 01 * *', async function(){
        const rankService: RankService = new RankService();
	    const userService: UserService = new UserService();

	    try{
		    const userList = await userService.getAllUserId();
		    await rankService.resetMonthRank(userList);
		    console.log("월간 랭킹 초기화 완료");
	    }
	    catch (error) {
		    console.log(error);
		    console.log("월간 랭킹 초기화 실패");
	    }
      });
    // await insertSeed();
});
