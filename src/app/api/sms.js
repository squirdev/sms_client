import axiosApi from "../../../utils/axios";

export const sendSMS = async (sender, phoneList, smsContent, networkIndex) => {
  try {
    const response = await axiosApi.post("/sms", {
      sender: sender,
      phoneList: phoneList,
      smsContent: smsContent,
      network: networkIndex,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getSMS = async () => {
  try {
    const response = await axiosApi.get("/sms");
    return response;
  } catch (error) {
    return error.response;
  }
};
