export const validationSignIn = (username, password) => {
  if (username == "" || password == "") {
    return {
      result: false,
      message: "请输入所有信息。",
    };
  } else
    return {
      result: true,
      message: "",
    };
};

export const validationSendSMS = (phoneList, smsContent, sender) => {
  if (phoneList == "" || smsContent == "" || sender == "") {
    return {
      result: false,
      message: "请输入所有信息。",
    };
  } else if (smsContent.length > 140) {
    return {
      result: false,
      message: "短信内容长度必须小于70。",
    };
  } else
    return {
      result: true,
      message: "",
    };
};
