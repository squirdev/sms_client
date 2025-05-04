"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomAlert from "../components/customAlert";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { logout } from "../../../redux/authSlice";
import { getSMS } from "../api/sms";

export default function SMSManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [smsData, setSMSData] = useState([]);
  const [totolAmount, setTotalAmount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [phonelist, setPhoneList] = useState([]);
  const [s_phonelist, setSPhoneList] = useState([]);
  const handleOpen = () => setOpen(!open);
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };
  const fetchData = async () => {
    const searchResult = await getSMS();
    if (searchResult.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (searchResult.status === 200) {
      setSMSData(searchResult.data.data);
      let total = searchResult.data.data.reduce(
        (sum, data) => sum + data.withdraw,
        0
      );
      setTotalAmount(total);
      return;
    }
    showMessage(searchResult);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const TABLE_HEAD = [
    "发送号码数量",
    "成功号码数量",
    "内容",
    "发件人 ID",
    "费用",
    "时间",
  ];
  return (
    <div className="p-10 w-[80%] justify-center flex flex-col gap-4">
      <CustomAlert message={alertMessage} />
      <p className="font-medium">总发送费用: ${totolAmount}</p>
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
          {smsData.map((data, index) => {
            const isLast = index === smsData.length - 1;
            const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-50";
            return (
              <tr
                key={index}
                className="hover:bg-gray-500"
                onClick={() => {
                  setPhoneList(data.phonelist);
                  setSPhoneList(data.success_phonelist);
                  handleOpen();
                }}
              >
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.phonelist.length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.success_phonelist.length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.content}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.sender}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    ${data.withdraw}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.date.split("T")[0]}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {data.date.split("T")[1].slice(0, 5)}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>发送情况</DialogHeader>
        <DialogBody className="flex flex-row w-full gap-2">
          <div className="w-full gap-2 flex flex-col">
            <p>已发送列表({phonelist.length})</p>{" "}
            <textarea
              value={s_phonelist.join("\n")}
              readOnly
              className="w-full h-48 overflow-auto border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
          <div className="w-full gap-2 flex flex-col">
            <p>成功列表({s_phonelist.length})</p>{" "}
            <textarea
              value={s_phonelist.join("\n")}
              readOnly
              className="w-full h-48 overflow-auto border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
