"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomAlert from "../components/customAlert";
import { Typography } from "@material-tailwind/react";
import { logout } from "../../../redux/authSlice";
import { getPayment } from "../api/payment";

export default function PaymentManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentData, setPaymentData] = useState([]);
  const [totolAmount, setTotalAmount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };
  const fetchData = async () => {
    const searchResult = await getPayment();
    if (searchResult.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (searchResult.status === 200) {
      setPaymentData(searchResult.data);
      let total = searchResult.data.reduce((sum, data) => sum + data.amount, 0);
      setTotalAmount(total);
      return;
    }
    showMessage(searchResult);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const TABLE_HEAD = ["充值金额", "时间"];
  return (
    <div className="p-10 w-[80%] justify-center flex flex-col gap-4 h-full">
      <CustomAlert message={alertMessage} />
      <p className="font-medium">总充值金额: ${totolAmount}</p>
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
          {paymentData.map((data, index) => {
            const isLast = index === paymentData.length - 1;
            const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-50";
            return (
              <tr key={index} className="hover:bg-gray-500">
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    ${data.amount}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.t_time.split("T")[0]}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.t_time.split("T")[1].slice(0, 5)}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
