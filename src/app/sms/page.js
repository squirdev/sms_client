"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import { getSimplifiedDateTime } from "@/helper";
import TableLoading from "../components/tableLoading";
import TableNoData from "../components/tableNoData";

export default function SMSManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [smsData, setSMSData] = useState([]);
  const [open, setOpen] = useState(false);
  const [phonelist, setPhoneList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(!open);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const searchResult = await getSMS();
      if (searchResult.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (searchResult.status === 200) {
        console.log("searchResult.data", searchResult.data);
        setSMSData(searchResult.data.data);
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
  const TABLE_HEAD = ["No", "发送号码数量", "内容", "发件人 ID", "时间"];
  return (
    <div className="p-10 w-[80%] justify-center flex flex-col gap-4">
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
          ) : smsData && smsData.length != 0 ? (
            smsData.map((data, index) => {
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-300"
                  onClick={() => {
                    setPhoneList(data.phonelist);
                    handleOpen();
                  }}
                >
                  {[
                    index + 1,
                    data.phonelist.length,
                    data.content,
                    data.sender,
                    getSimplifiedDateTime(data.date),
                  ].map((item, index) => (
                    <td
                      key={index}
                      className="p-2 border-b border-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item}
                      </Typography>
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <TableNoData colSpan={TABLE_HEAD.length} />
          )}
        </tbody>
      </table>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>发送情况</DialogHeader>
        <DialogBody className="flex flex-row w-full gap-2">
          <div className="w-full gap-2 flex flex-col">
            <p>成功列表({phonelist.length})</p>{" "}
            <textarea
              value={phonelist.join("\n")}
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
            <span>确认</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
