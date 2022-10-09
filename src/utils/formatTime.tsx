const formatDate = (date: Date) => {
  const rtf = new Intl.RelativeTimeFormat("en", {
    style: "long",
  });
  const days = Math.floor((new Date().getTime() - date.getTime()) / 86400000);
  const hours = Math.floor((new Date().getTime() - date.getTime()) / 3600000);
  const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);

  if (days > 0) {
    return rtf.format(-days, "day");
  }
  if (hours > 0) {
    return rtf.format(-hours, "hour");
  }
  if (minutes > 0) {
    return rtf.format(-minutes, "minute");
  }
  return "just now";
};

export default formatDate;
