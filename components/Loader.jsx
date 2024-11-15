const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full rounded-full border-4 border-t-transparent border-gradient animate-spin"></div>
      </div>
      <p className="mt-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loading;
