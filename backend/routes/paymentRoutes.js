import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import {
  createPayment,
  getPaymentByOrderId,
  listPaidPayments,
  reviewRefundRequest,
  directRefundPayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payments", requireAuth, createPayment);
router.get("/payments/list", requireAuth, listPaidPayments);
router.get("/payments/order/:orderId", requireAuth, getPaymentByOrderId);
router.patch("/payments/:id/refund-review", requireAuth, requireAdmin, reviewRefundRequest);
router.patch("/payments/:id/refund-direct", requireAuth, requireAdmin, directRefundPayment);

export default router;
