import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">
          <Link href={"/"} className="block sm:hidden font-medium">
            AG
          </Link>
          <Link href={"/"} className="hidden sm:block">
            AbhishekGhimire
          </Link>
        </h1>
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
                  <div id="external-link-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
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
