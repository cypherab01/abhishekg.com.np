import { PageHeader, PageHeaderHeading } from "@/components/page-header";

const TestimonialsPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Testimonials</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          Get the truth from those who’ve seen my work firsthand!
        </PageHeaderHeading>
      </PageHeader>
    </>
  );
};
export default TestimonialsPage;
