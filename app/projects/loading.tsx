const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="container max-w-4xl p-4 mx-auto md:p-8">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};
export default Loading;
