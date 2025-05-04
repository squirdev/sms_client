import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { updateUser } from "@/app/api/user";
import CustomAlert from "@/app/components/customAlert";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../../redux/authSlice";

export default function UpdateUser({ updateOpen, handleUpdateOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  const handleUpdateUser = async () => {
    if (!formData.username || !formData.password) {
      showMessage("正确输入所有信息。");
      return;
    }
    setIsLoading(true);
    const result = await updateUser(formData.username, formData.password);
    if (result.status === 401) {
      handleLogout();
      return;
    }
    if (result.status === 200) {
      showMessage("用户信息更新成功。将退出。请重新登录。");
      await sleep(2000);
      setIsLoading(false);
      handleUpdateOpen();
      setFormData({
        username: "",
        password: "",
      });
      handleLogout();
    }
    showMessage(
      result?.data?.message || "更新用户失败，请稍后重试或联系管理员。"
    );
    setIsLoading(false);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function generateRandomLetters(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }
  return (
    <div>
      <Dialog open={updateOpen} handler={handleUpdateOpen}>
        <DialogHeader>更新用户</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <CustomAlert message={alertMessage} />
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">用户名</p>
            <Input
              label="用户名"
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formData.username);
                  showMessage("已成功复制到剪贴板。");
                } catch (error) {
                  showMessage("无法复制到剪贴板。");
                }
              }}
              className="w-full"
            >
              <IoCopyOutline className="w-full" />
            </IconButton>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  username: generateRandomLetters(5),
                }))
              }
              className="w-full"
            >
              <IoMdRefresh className="w-full" />
            </IconButton>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="whitespace-nowrap w-[10%]">密码</p>
            <Input
              label="密码"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formData.password);
                  showMessage("已成功复制到剪贴板。");
                } catch (error) {
                  showMessage("无法复制到剪贴板。");
                }
              }}
              className="w-full"
            >
              <IoCopyOutline />
            </IconButton>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  password: generateRandomLetters(5),
                }))
              }
              className="w-full"
            >
              <IoMdRefresh />
            </IconButton>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleUpdateOpen}
            className="mr-1"
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleUpdateUser}
            disabled={isLoading}
            className="flex flex-row items-center gap-2"
          >
            {isLoading && <Spinner className="h-4" />}
            <span>是</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
