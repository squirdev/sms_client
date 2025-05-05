"use client";

import {
  Button,
  Card,
  IconButton,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import CustomAlert from "../components/customAlert";
import { validationSendSMS } from "./helper";
import { sendSMS } from "../api/sms";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaRegFolder } from "react-icons/fa";
import { logout } from "../../../redux/authSlice";
import { getUser } from "../api/payment";
export default function SendingSMS() {
  const [sender, setSender] = useState("");
  const [phoneList, setPhoneList] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [networkIndex, setNetworkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchData = async () => {
    const response = await getUser();
    if (response.status === 401) {
      dispatch(logout());
      router.push("/login");
      return;
    }
    if (response.status === 200) {
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleSendSMS = async () => {
    let checkValid = validationSendSMS(phoneList, smsContent, sender);
    if (!checkValid.result) {
      showMessage(checkValid.message);
      return;
    }
    if (phoneList.split(/\r?\n/).length > 10000) {
      showMessage("电话号码列表超过10000行，请分批发送。");
      return;
    }
    if (smsContent.length > 70) {
      showMessage("短信内容长度必须小于70个字符");
      return;
    }
    try {
      setIsLoading(true);
      const result = await sendSMS(
        sender,
        phoneList.split(/\r?\n/),
        smsContent,
        networkIndex
      );
      if (result.status === 401) {
        dispatch(logout());
        router.push("/login");
      }
      if (result.status === 200) {
        setSender("");
        setPhoneList("");
        setSmsContent("");
        showMessage("已发送成功！");
      }
      // showMessage(result.data.message);
    } catch (error) {
      showMessage("服务器发生意外错误");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoneList(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="h-full py-10 justify-center items-center flex">
        <CustomAlert message={alertMessage} />
        <Card
          color="transparent"
          shadow={false}
          className="w-[700px] flex flex-col gap-8 items-start gap-2"
        >
          <Typography variant="h4" color="blue-gray/10">
            发送短信
          </Typography>
          <div className="w-full">
            <Typography variant="h6" color="blue-gray/10" className="self-end">
              选择网络
            </Typography>
            <Select onChange={(e) => setNetworkIndex(e)}>
              <Option value={0}>网络1(香港)</Option>
              <Option value={1}>网络2(澳门)</Option>
              <Option value={2}>网络3(香港, 澳门)</Option>
            </Select>
          </div>
          <div className="w-full">
            <Typography variant="h6" color="blue-gray/10" className="self-end">
              发件人 ID
            </Typography>
            <Input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="bg-white w-full"
            />
          </div>
          <div className="w-full flex flex-col items-end gap-1">
            <div className="w-full flex justify-between">
              <Typography
                variant="h6"
                color="blue-gray/10"
                className="self-end"
              >
                电话号码列表
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt, .csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <IconButton onClick={handleLoadFile} color="white">
                <FaRegFolder />
              </IconButton>
            </div>
            <textarea
              value={phoneList}
              onChange={(e) => setPhoneList(e.target.value)}
              placeholder="电话号码列表超过10000行。"
              className="w-full h-48 overflow-auto outline-none border border-gray-500 rounded-md p-3 resize-none"
            />
          </div>
          <div className="w-full">
            <div>
              <Typography
                variant="h6"
                color="blue-gray/10"
                className="self-end"
              >
                选择模板
              </Typography>
            </div>
          </div>
          <textarea
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
            placeholder="内容长度不能超过70。"
            maxLength={70}
            className="w-full h-auto overflow-auto outline-none border border-gray-500 rounded-md p-3 resize-none"
          />
          <div className="flex justify-end w-full">
            <Button onClick={handleSendSMS} color="blue" loading={isLoading}>
              发送
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
