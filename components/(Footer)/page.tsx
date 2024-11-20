import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div id="social" className="flex flex-row items-center justify-center">
          <Link href={"https://linkedin.com/in/cypherab01"}>LinkedIn</Link>
          <div className="mx-4">
            <Separator orientation="vertical" className="h-4" />
          </div>

          <Link href={"https://t.me/cypherab01"}>Telegram</Link>
          <div className="mx-4">
            <Separator orientation="vertical" className="h-4" />
          </div>

          <Link href={"https://x.com/cypherab01"}>X</Link>
          <div className="mx-4">
            <Separator orientation="vertical" className="h-4" />
          </div>

          <Link href={"https://github.com/cypherab01"}>GitHub</Link>
          <div className="mx-4">
            <Separator orientation="vertical" className="h-4" />
          </div>

          <Link href={"mailto:hi@abhishekg.com.np"}>Email</Link>
        </div>
        <div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Abhishek Ghimire · All Rights
            Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
