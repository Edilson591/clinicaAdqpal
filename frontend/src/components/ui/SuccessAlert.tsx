function SuccessAlert({ message }: { message: string }) {
  return (
    <div
      className="w-full mt-6 p-4 rounded-lg flex items-center gap-3"
      style={{
        backgroundColor: "rgba(56, 161, 105, 0.1)",
        border: "1px solid rgba(56, 161, 105, 0.3)",
      }}
      role="alert"
      aria-live="polite"
    >
      <svg
        className="h-5 w-5 shrink-0"
        style={{ color: "#38a169" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm" style={{ color: "#276749" }}>
        {message}
      </p>
    </div>
  );
}

export default SuccessAlert;
