const Preloader = () => {
  return (
    // TODO: fix margin top and make look less like a void
    <div className="flex flex-col items-center justify-center mt-20">
      <div>
        <span className="loader"></span>
        <span className="sr-only">Loading</span>
      </div>
      <p className="mt-5 text-grayAlt">Hello, HAL. Do you read me, HAL?</p>
    </div>
  );
};

export default Preloader;
