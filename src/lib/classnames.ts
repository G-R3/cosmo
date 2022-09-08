const clx = (...classes: (string | boolean | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export default clx;
