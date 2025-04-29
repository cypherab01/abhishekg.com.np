import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import Pager from "@/components/pager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeSnippet from "@/components/code-snippet";
import { code } from "@/config/codeContent";
import ContactForm from "./ContactForm";

const ContactPage = async () => {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Contact</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          Get in touch before I write another line of code!
        </PageHeaderHeading>
      </PageHeader>

      <div id="tabs" className="flex items-center mt-8">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="max-w-[300px] w-full">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="mt-4">
            <ContactForm />
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <CodeSnippet title="contact.ts" code={code.contact} />
          </TabsContent>
        </Tabs>
      </div>

      <Pager
        prevHref="/education"
        nextHref="/stats"
        prevTitle="Education"
        nextTitle="Stats"
      />
    </>
  );
};
export default ContactPage;
