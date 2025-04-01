import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { getViewsServerAction } from "../actions/getAndSetViewsServerAction";
import { getLoveCountServerAction } from "../actions/getAndSetLoveCountServerAction";
import LoveButtonComponent from "./LoveButtonComponent";
import { getGitHubStatsServerAction } from "../actions/getGitHubStatsServerAction";
import GitHubGraphs from "./GitHubGraphs";

const StatCard = ({
  title,
  value,
  className = "",
}: {
  title: string;
  value: string | number;
  className?: string;
}) => (
  <div
    className={`card border border-border/40 rounded-xl p-4 w-full h-full transition-transform duration-200 hover:scale-105 ${className}`}
  >
    <div className="card-content">
      <h3 className="card-title text-lg font-semibold tracking-tight text-muted-foreground">
        {title}
      </h3>
      <span className="card-value text-5xl leading-tight font-bold tracking-tight text-muted-foreground">
        {value}
      </span>
    </div>
  </div>
);

const Stats = async () => {
  const views = await getViewsServerAction();
  const loveCount = await getLoveCountServerAction();
  const githubStats = await getGitHubStatsServerAction();

  const githubStatCards = [
    {
      title: "Hireable",
      value: githubStats.hireable ? "Yes" : "No",
      className: githubStats.hireable ? "bg-green-500/20" : "",
    },
    {
      title: "Total Public Repositories",
      value: githubStats.public_repos || 0,
    },
    {
      title: "Followers",
      value: githubStats.followers || 0,
    },
    {
      title: "Following",
      value: githubStats.following || 0,
    },
    {
      title: "Current Company",
      value: githubStats.company || "N/A",
    },
    {
      title: "Location",
      value: githubStats.location || "N/A",
    },
  ];

  return (
    <>
      {/* About this portfolio */}
      <PageHeader>
        <PageHeaderHeading>About this portfolio</PageHeaderHeading>
        <PageHeaderDescription>
          Insights and metrics about this portfolio website
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="group flex flex-col p-8 bg-card/50 backdrop-blur-sm text-card-foreground rounded-xl border border-border/40 hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/70"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              &nbsp;Total Views
            </h3>
            <div className="h-[1px] w-full bg-muted/60"></div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-6 relative z-10">
            {views.success === true ? (
              <p className="text-5xl font-bold text-primary">{views.message}</p>
            ) : (
              <p className="text-xl font-bold text-destructive">
                Failed to fetch views
              </p>
            )}
            {views.success && (
              <p className="text-sm text-muted-foreground text-center mt-4 max-w-[80%]">
                Unique page visits since April 2025
              </p>
            )}
          </div>
        </div>

        <div className="group flex flex-col p-8 bg-card/50 backdrop-blur-sm text-card-foreground rounded-xl border border-border/40 hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-rose-500/70"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              &nbsp;Appreciation Count
            </h3>
            <div className="h-[1px] w-full bg-muted/60"></div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-4 relative z-10">
            {loveCount.success === true ? (
              <>
                <p
                  className="text-5xl font-bold text-rose-500 py-6"
                  id="love-count"
                >
                  {loveCount.count}
                </p>
                <LoveButtonComponent />
              </>
            ) : (
              <p className="text-xl font-bold text-destructive">
                Failed to fetch appreciation count
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About GitHub Stats */}
      <PageHeader className="mt-8 mb-4">
        <PageHeaderHeading>GitHub Stats</PageHeaderHeading>
        <PageHeaderDescription>
          Insights and metrics about my GitHub profile
        </PageHeaderDescription>
      </PageHeader>

      {/* GitHub Graphs */}
      <div className="mb-8 w-full flex justify-center items-center border border-border/40 rounded-xl p-4">
        <GitHubGraphs />
      </div>

      <div className="mb-8">
        <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-4">
          {githubStatCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              className={card.className}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Stats;
