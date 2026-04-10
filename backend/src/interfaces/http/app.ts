import express from "express";
import morgan from "morgan";
import userRoutes from "../routes/userRoutes";
import patientRoutes from "../routes/patientRoutes";
import appointmentRoutes from "../routes/appointmentRoutes";
import medicalRecordRoutes from "../routes/medicalRecordRoutes";
import patientHistoryRoutes from "../routes/patientHistoryRoutes";
import historyRoutes from "../routes/historyRoutes";
import specialtyRoutes from "../routes/specialtyRoutes";
import financialAccountRoutes from "../routes/financialAccountRoutes";
import financialCategoryRoutes from "../routes/financialCategoryRoutes";
import transactionRoutes from "../routes/transactionRoutes";
import pluggyRoutes from "../routes/pluggyRoutes";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import cors from "cors";

const app = express();
//setando o cors e o json
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5174","http://localhost:8080","http://localhost:3000","http://localhost"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/medical-records", medicalRecordRoutes);
app.use("/patients/:patientId/history", patientHistoryRoutes);
app.use("/history", historyRoutes);
app.use("/specialties", specialtyRoutes);
app.use("/financial/accounts", financialAccountRoutes);
app.use("/financial/categories", financialCategoryRoutes);
app.use("/financial/transactions", transactionRoutes);
app.use("/pluggy", pluggyRoutes);

app.use(errorMiddleware);

export default app;
