import { highlightCode } from "@/lib/highlight-code";
import React from "react";

const CodeSnippet = async ({
  title,
  code,
}: {
  title: string;
  code: string;
}) => {
  const highlightedCode = await highlightCode(code);
  return (
    <React.Fragment>
      <h4 className="my-4 mb-2 text-lg font-semibold tracking-tight scroll-m-20">
        {title}
      </h4>
      <div className="relative overflow-auto bg-black rounded-lg ring-1 ring-gray-700">
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
          className="w-full overflow-hidden [&_pre]:overflow-auto [&_pre]:!bg-black [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </div>
    </React.Fragment>
  );
};
export default CodeSnippet;
