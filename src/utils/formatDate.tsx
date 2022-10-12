const formatDate = (date: Date) => {
  const dtf = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  });

  return dtf.format(date);
};

export default formatDate;
