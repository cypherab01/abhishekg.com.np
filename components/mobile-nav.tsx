"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { docsConfig } from "@/config/docs";
import { cn } from "@/lib/utils";
import { useMetaColor } from "@/hooks/use-meta-color";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ModeSwitcher } from "./mode-switcher";
import { siteConfig } from "@/config/site";
import { Icons } from "./icons";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { setMetaColor, metaColor } = useMetaColor();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      setMetaColor(open ? "#09090b" : metaColor);
    },
    [setMetaColor, metaColor]
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-8 gap-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
          <span className="sr-only">Toggle Menu</span>
          <span className="flex items-center justify-between flex-1 h-8 px-2 text-sm font-normal border rounded-md shadow-none bg-muted/50 text-muted-foreground">
            Search sections...
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerTitle>
        <DrawerContent className="max-h-[80svh] p-0">
          <div className="p-6 overflow-auto">
            <div className="flex items-center justify-between gap-2 my-6">
              <h4 className="text-xl font-medium">Abhishek Ghimire</h4>
              <div className="flex items-center justify-center gap-4">
                <ModeSwitcher className="size-6" />
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="size-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  )
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 pt-6">
                  <h4 className="text-xl font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map((item: any) => (
                      <React.Fragment key={item.href}>
                        {!item.disabled &&
                          (item.href ? (
                            <MobileLink
                              href={item.href}
                              onOpenChange={setOpen}
                              className="opacity-80"
                            >
                              {item.title}
                              {item.label && (
                                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                  {item.label}
                                </span>
                              )}
                            </MobileLink>
                          ) : (
                            item.title
                          ))}
                      </React.Fragment>
                    ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="items-center hidden gap-2 ml-auto md:flex-1 md:justify-end md:flex">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="w-4 h-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              — End of the menu —
            </p>
          </div>
        </DrawerContent>
      </DrawerTitle>
    </Drawer>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-[1.15rem] border-b border-border pb-2", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
