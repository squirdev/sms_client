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

export function detectLanguages(inputStr) {
  const hasChinese = /[\u4E00-\u9FFF]/.test(inputStr);
  const hasSpanish = /[áéíóúñü¡¿ÁÉÍÓÚÑÜ]/.test(inputStr);
  const hasEnglish = /[A-Za-z]/.test(inputStr);
  const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(inputStr);

  return { hasChinese, hasSpanish, hasEnglish, hasArabic };
}

export const validationSendSMS = (phoneList, smsContent, sender) => {
  if (phoneList == "" || smsContent == "" || sender == "") {
    return {
      result: false,
      message: "请输入所有信息。",
    };
  }

  const lanDetectResult = detectLanguages(smsContent);

  const isUniCode = lanDetectResult.hasChinese || lanDetectResult.hasArabic;

  const limit = isUniCode ? 70 : 140;
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
