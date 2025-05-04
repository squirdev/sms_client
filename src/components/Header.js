import {
  Button,
  ButtonGroup,
  Card,
  IconButton,
} from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../redux/authSlice";
import { useEffect, useState } from "react";
import { getUser } from "@/app/api/payment";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserGear } from "react-icons/fa6";
import UpdateUser from "./UpdateUser";
const Header = () => {
  const [user, setUser] = useState({});
  const [updateOpen, setUpdateOpen] = useState(false);
  const handleUpdateOpen = () => {
    setUpdateOpen(!updateOpen);
  };
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  useEffect(() => {
    const fetchData = async () => {
      const searchResult = await getUser();
      if (searchResult.status === 401) {
        handleLogout();
        return;
      }
      if (searchResult.status === 200) {
        setUser(searchResult.data);
        const user = searchResult.data;
        dispatch(updateUser({ user }));
        return;
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {isAuth ? (
        <div className="p-2 flex justify-center items-center w-screen">
          <Card className="flex flex-row gap-4 justify-center items-center shadow-lg px-5 py-2">
            <Link href="/">
              <img src="/logo.png" className="w-[250px]" />
            </Link>
            <ButtonGroup variant="text">
              <Button
                variant="outlined"
                className="border-white whitespace-nowrap"
                onClick={() => router.push("main")}
              >
                <p className="text-3xl normal-case">短信发送</p>
              </Button>
              <Button
                variant="outlined"
                className="border-white whitespace-nowrap"
                onClick={() => router.push("sms")}
              >
                <p className="text-3xl normal-case">短信日志</p>
              </Button>
              <Button
                variant="outlined"
                className="border-white whitespace-nowrap"
                onClick={() => router.push("payment")}
              >
                <p className="text-3xl normal-case">充值日志</p>
              </Button>
            </ButtonGroup>
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="">余额: ${user.usdt?.toFixed(2)}</p>
              <p className="">短信价格: {user.price}$/条</p>
              <div className="flex gap-2">
                <IconButton
                  onClick={handleUpdateOpen}
                  size="md"
                  color="green"
                  className="flex items-center justify-center"
                >
                  <FaUserGear size={24} />
                </IconButton>
                <IconButton
                  onClick={handleLogout}
                  size="md"
                  color="red"
                  className="flex items-center justify-center"
                >
                  <IoLogOutOutline size={24} />
                </IconButton>
              </div>
            </div>
            <UpdateUser
              updateOpen={updateOpen}
              handleUpdateOpen={handleUpdateOpen}
            />
          </Card>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Header;
