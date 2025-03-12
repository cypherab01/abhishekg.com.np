import { Binary } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-end justify-end border-2 border-primary bg-primary text-primary-foreground rounded-sm size-16 select-none ring-4 ring-primary/20">
      <div className="flex items-center justify-center">
        <div className="text-2xl font-bold uppercase tracking-tight">AG</div>
        <div className="-mt-4">
          <Binary className="size-2" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
export default Logo;
