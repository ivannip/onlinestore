import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import transactionRouter from "./routes/transaction.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/transaction", transactionRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use(
  (
    err: createError.HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      message: err.message,
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
