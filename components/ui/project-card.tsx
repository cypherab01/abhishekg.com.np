interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
}

export function ProjectCard({ title, description, skills }: ProjectCardProps) {
  return (
    <div className="group rounded-lg border border-border p-5 transition-colors hover:border-primary/30 hover:bg-muted/30">
      <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
