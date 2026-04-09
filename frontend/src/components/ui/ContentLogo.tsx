type PropsContentLogo = {
  logo: string;
};

export const ContentLogo = ({ logo }: PropsContentLogo) => {
  return (
    <div className="flex items-center justify-center  rounded-lg px-3 py-2 min-w-10 transition-all duration-300">
      <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
        {/* {expanded ? "ADQPAL" : "A"} */}
        <img
          src={logo}
          className="m-auto bg-white rounded-[7px] transition-all duration-300 hover:scale-105"
          alt="logo adqpal"
        />
      </span>
    </div>
  );
};
