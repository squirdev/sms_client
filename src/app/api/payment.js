import axiosApi from "../../../utils/axios";

export const getPayment = async () => {
  try {
    const response = await axiosApi.get("/payment");
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getUser = async () => {
  try {
    const response = await axiosApi.get("/payment/user");
    return response;
  } catch (error) {
    return error.response;
  }
};
