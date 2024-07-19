function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3f3f44"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={"animate-spin"}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}

export default LoadingSpinner;
