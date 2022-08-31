const clx = (...classes: (string | boolean)[]) =>
  classes.filter(Boolean).join(" ");

export default clx;
