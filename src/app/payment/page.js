"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { logout } from "../../../redux/authSlice";
import { getPayment } from "../api/payment";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";
import { getSimplifiedDateTime } from "@/helper";

export default function PaymentManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [totolAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const searchResult = await getPayment();
      if (searchResult.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (searchResult.status === 200) {
        setPaymentData(searchResult.data);
        let total = searchResult.data.reduce(
          (sum, data) => sum + data.amount,
          0
        );
        setTotalAmount(total);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const TABLE_HEAD = ["充值金额", "时间"];
  return (
    <div className="p-10 w-[80%] justify-center flex flex-col gap-4 h-full">
      <div className="flex gap-1 font-medium">
        <p>总充值金额: $</p>
        <p>{totolAmount}</p>
      </div>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-gray-100 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <TableLoading colSpan={TABLE_HEAD.length} />
          ) : paymentData && paymentData.length != 0 ? (
            paymentData.map((data, index) => {
              return (
                <tr key={index} className="hover:bg-gray-300">
                  <td className="p-2 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      ${data.amount}
                    </Typography>
                  </td>
                  <td className="p-2 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {getSimplifiedDateTime(data.t_time)}
                    </Typography>
                  </td>
                </tr>
              );
            })
          ) : (
            <TableNoData colSpan={TABLE_HEAD.length} />
          )}
        </tbody>
      </table>
    </div>
  );
}
