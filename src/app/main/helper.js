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

function detectLanguage(text) {
  if (/[\u4e00-\u9fff]/.test(text)) {
    return "CH";
  } else if (/[a-zA-Z]/.test(text)) {
    // Check for Spanish-specific characters
    if (/[ñáéíóúü¿¡]/i.test(text)) {
      return "SP";
    } else {
      return "EN";
    }
  } else {
    return "Unknown";
  }
}

export const validationSendSMS = (phoneList, smsContent, sender) => {
  if (phoneList == "" || smsContent == "" || sender == "") {
    return {
      result: false,
      message: "请输入所有信息。",
    };
  }
  const isUnicode = detectLanguage(smsContent) == "CH";
  const limit = isUnicode ? 70 : 140;
  if (smsContent.length > limit) {
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
