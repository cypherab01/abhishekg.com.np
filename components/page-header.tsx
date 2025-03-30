import { cn } from "@/lib/utils";

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("", className)} {...props}>
      <div className="">
        <div className="flex flex-col items-start gap-1 py-0">{children}</div>
      </div>
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-2xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]",
        className
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "w-full text-left text-base font-light text-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  );
}

function PageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-start gap-2 my-4 pt-2",
        className
      )}
      {...props}
    />
  );
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading };
