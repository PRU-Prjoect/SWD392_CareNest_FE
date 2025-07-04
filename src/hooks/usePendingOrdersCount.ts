import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllAppointments } from "@/store/slices/appointmentSlice";
import { AppointmentStatus } from "@/types/enums";

export const usePendingOrdersCount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!user?.id) {
        setPendingCount(0);
        return;
      }

      setLoading(true);
      try {
        // ✅ Chỉ lấy appointments với status NoProgress (pending)
        const result = await dispatch(
          getAllAppointments({
            customerId: user.id,
            status: AppointmentStatus.NoProgress,
          })
        ).unwrap();

        setPendingCount(result.data.length);
      } catch (error) {
        console.error("Error fetching pending orders count:", error);
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCount();

    // ✅ Auto refresh mỗi 30 giây để cập nhật real-time
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [dispatch, user?.id]);

  return { pendingCount, loading };
};
