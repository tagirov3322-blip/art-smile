import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", requireAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalBookings, newBookings, confirmedBookings, completedBookings, cancelledBookings, todayBookings, totalDoctors, totalServices, totalReviews, pendingReviews] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "new" } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.booking.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.doctor.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const popularServices = await prisma.booking.groupBy({
    by: ["serviceId"], _count: { serviceId: true }, orderBy: { _count: { serviceId: "desc" } }, take: 5,
  });

  const serviceIds = popularServices.map((s) => s.serviceId);
  const services = await prisma.service.findMany({ where: { id: { in: serviceIds } }, select: { id: true, name: true } });

  res.json({
    totalBookings, newBookings, confirmedBookings, completedBookings, cancelledBookings, todayBookings,
    totalDoctors, totalServices, totalReviews, pendingReviews,
    popularServices: popularServices.map((s) => ({
      serviceId: s.serviceId,
      serviceName: services.find((srv) => srv.id === s.serviceId)?.name || "Неизвестно",
      count: s._count.serviceId,
    })),
  });
}));

export default router;
