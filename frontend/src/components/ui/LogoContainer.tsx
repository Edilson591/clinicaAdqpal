function LogoContainer() {
  return (
    <div
      className="w-30 h-12 rounded-lg flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #2d3748 0%, #38a169 100%)",
      }}
      aria-label="Logo ADQPAL"
    >
      <span className="text-white font-bold text-sm tracking-wider">
        ADQPAL
      </span>
    </div>
  );
}

export default LogoContainer;

export { LogoContainer };
