import { Alert } from "@material-tailwind/react";
import { BiInfoCircle } from "react-icons/bi";

const CustomAlert = ({ message }) => {
  return (
    message && (
      <Alert
        icon={<BiInfoCircle />}
        className="fixed w-auto top-16 right-4 text-sm"
      >
        <p>{message}</p>
      </Alert>
    )
  );
};

export default CustomAlert;
