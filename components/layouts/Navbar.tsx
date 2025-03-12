import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Logo from "@/components/user-components/Logo";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Logo />
        <nav>
          <ul className="flex items-center justify-center">
            <li>
              <Link href={"/"} className="text-muted-foreground">
                Home
              </Link>
            </li>
            <li className="mx-4">
              <Separator orientation="vertical" className="h-4" />
            </li>
            <li>
              <Link
                href={"https://github.com/cypherab01?tab=repositories"}
                target="_blank"
              >
                <div className="flex gap-1">
                  Projects
                  <div>
                    <ExternalLink className="size-4" />
                  </div>
                </div>
              </Link>
            </li>
            <li className="mx-4">
              <Separator orientation="vertical" className="h-4" />
            </li>
            <li>
              <Link href={"/blogs"}>Blogs</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
