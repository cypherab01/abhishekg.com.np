import { LoaderCircle } from "lucide-react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <LoaderCircle className="size-8 animate-spin text-primary" />
    </div>
  );
};
export default loading;
