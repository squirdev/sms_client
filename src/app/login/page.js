"use client";

import { Button, Card, Typography, Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validationSignIn } from "./helper";
import CustomAlert from "../components/customAlert";
import { signin } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/authSlice";
import Image from "next/image";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const dispatch = useDispatch();

  const showMessage = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    let checkValid = validationSignIn(username, password);
    if (!checkValid.result) {
      showMessage(checkValid.message);
      return;
    }
    try {
      setIsLoading(true);
      let result = await signin(username, password);
      showMessage(result.message);
      if (result.success) {
        let token = result.token;
        let user = result.user;
        dispatch(login({ token, user }));
        router.push("/main");
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };
  const { isAuth } = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (isAuth) {
      router.push("/main");
    }
  }, []);

  return (
    <div className="flex flex-row w-full bg-cover bg-center h-screen ml-0">
      <div className="w-1/2 h-full relative bg-[url('/bg.jpg')] bg-bottom bg-no-repeat bg-cover">
        <div className="absolute top-0 left-0">
          <Image src="/logo.png" width={320} height={80} alt="logo" />
        </div>
      </div>
      <div className="content w-1/2">
        <CustomAlert message={alertMessage} />
        <div className="h-screen flex items-center justify-center">
          <Card
            shadow={false}
            color="transparent"
            className="p-4 text-gray-500"
          >
            <div className="text-gray-900">
              <div className="flex items-self-center justify-self-center">
                <Typography className="font-medium items-self-center text-2xl">
                  登陆
                </Typography>
              </div>
              <form className="mt-8 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                  <Input
                    size="lg"
                    label="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="relative flex items-center justify-end">
                    <Input
                      type={isPasswordShow ? "text" : "password"}
                      size="lg"
                      label="密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute mr-4 cursor-pointer"
                      onClick={(e) => setIsPasswordShow(!isPasswordShow)}
                    >
                      {isPasswordShow ? <BsEyeSlash /> : <BsEye />}
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  onClick={handleSignin}
                  color="green"
                  className="mt-6 flex items-center justify-center"
                  fullWidth
                >
                  登陆
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
