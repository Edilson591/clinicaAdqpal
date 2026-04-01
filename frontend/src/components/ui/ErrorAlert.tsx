function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      className="w-full mt-6 p-4 rounded-lg flex items-center gap-3"
      style={{
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      }}
      role="alert"
      aria-live="polite"
    >
      <svg
        className="h-5 w-5 shrink-0"
        style={{ color: "#ef4444" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm" style={{ color: "#ef4444" }}>
        {message}
      </p>
    </div>
  );
}

export default ErrorAlert;
