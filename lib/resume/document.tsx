import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeView, ResumeTier, ResumeExperienceGroup } from "./types";
import { TIER_STYLES } from "./types";

const PAGE_MARGIN = 28; // ~0.4in, minimal margin per design brief
const INK = "#111111";

const SECTION_TITLES: Record<string, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Technical Skills",
  projects: "Projects",
};

function formatDateRange(start: string, end: string, current: boolean) {
  const endLabel = current ? "Present" : end;
  if (!start && !endLabel) return "";
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} – ${endLabel}`;
}

type HeaderLine = { text: string; href?: string };

/**
 * The left column (socials/website) and right column (email/phone/location)
 * are rendered as two independent vertical stacks rather than row-paired —
 * that keeps every gap within the right column uniform (same font, same
 * line-height throughout), since it's no longer sharing row boxes with the
 * much-taller name text. The right column gets a top offset so its first
 * line lines up with the bottom of the name instead of its top.
 */
function buildHeaderColumns(view: ResumeView) {
  const { profile, headerFields } = view;

  const socials = [
    headerFields.github && profile.github ? profile.github : null,
    headerFields.linkedin && profile.linkedin ? profile.linkedin : null,
  ].filter((v): v is string => Boolean(v));

  const leftLines: HeaderLine[] = [];
  if (socials.length > 0) leftLines.push({ text: socials.join("  |  ") });
  if (headerFields.website && profile.website) {
    leftLines.push({ text: profile.website, href: profile.website });
  }

  const rightLines: HeaderLine[] = [];
  if (headerFields.email && profile.email) {
    rightLines.push({ text: `Email: ${profile.email}`, href: `mailto:${profile.email}` });
  }
  if (headerFields.phone && profile.phone) {
    rightLines.push({ text: `Phone: ${profile.phone}` });
  }
  if (headerFields.location && profile.location) {
    rightLines.push({ text: profile.location });
  }

  return { leftLines, rightLines };
}

export default function ResumeDocument({
  view,
  tier,
}: {
  view: ResumeView;
  tier: ResumeTier;
}) {
  const t = TIER_STYLES[tier];

  const styles = StyleSheet.create({
    page: {
      paddingTop: PAGE_MARGIN,
      paddingBottom: PAGE_MARGIN,
      paddingHorizontal: PAGE_MARGIN,
      fontFamily: "Tinos",
      fontSize: t.baseFontSize,
      lineHeight: t.lineHeight,
      color: INK,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerName: {
      fontSize: t.nameFontSize,
      fontWeight: 700,
      lineHeight: 1.1,
    },
    headerLeftColumn: {
      flexShrink: 1,
    },
    headerRightColumn: {
      // Offsets the right column so its first line lines up with the
      // bottom of the (much taller) name, instead of its top.
      marginTop: t.nameFontSize * 1.1 - t.baseFontSize * t.lineHeight - 1,
    },
    headerLeft: {
      fontSize: t.baseFontSize,
    },
    headerRight: {
      fontSize: t.baseFontSize,
      textAlign: "right",
    },
    headerLink: {
      color: INK,
      textDecoration: "none",
    },
    section: {
      marginBottom: t.sectionGap,
    },
    sectionTitleBox: {
      borderBottomWidth: 1,
      borderBottomColor: INK,
      paddingBottom: 1,
      marginBottom: t.itemGap,
    },
    sectionTitleFirst: {
      fontSize: t.headingFontSize,
      fontWeight: 700,
      letterSpacing: 0.3,
    },
    sectionTitleRest: {
      fontSize: t.headingFontSize * 0.82,
      fontWeight: 700,
      letterSpacing: 0.3,
    },
    group: {
      marginBottom: t.itemGap,
    },
    item: {
      marginBottom: t.itemGap,
    },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemMainLeft: {
      fontWeight: 700,
    },
    itemMainRight: {
      fontWeight: 400,
    },
    itemSubRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemSubLeft: {
      fontStyle: "italic",
    },
    itemSubRight: {
      fontStyle: "italic",
    },
    bullet: {
      flexDirection: "row",
      marginTop: t.bulletGap,
      paddingLeft: 12,
    },
    bulletDot: {
      width: 10,
    },
    bulletText: {
      flex: 1,
    },
    skillLine: {
      marginBottom: t.bulletGap,
    },
    skillCategoryLabel: {
      fontWeight: 700,
    },
  });

  function SectionTitle({ sectionKey }: { sectionKey: string }) {
    const label = SECTION_TITLES[sectionKey] ?? sectionKey;
    const first = label.charAt(0).toUpperCase();
    const rest = label.slice(1).toUpperCase();
    return (
      <View style={styles.sectionTitleBox}>
        <Text>
          <Text style={styles.sectionTitleFirst}>{first}</Text>
          <Text style={styles.sectionTitleRest}>{rest}</Text>
        </Text>
      </View>
    );
  }

  function ExperienceGroupBlock({ group }: { group: ResumeExperienceGroup }) {
    return (
      <View style={styles.group}>
        {group.items.map((exp) => {
          const mainLeft = exp.company || exp.title;
          const subLeft = exp.company ? exp.title : "";
          const hasSubRow = Boolean(subLeft || exp.location);
          return (
            <View key={exp.id} style={styles.item}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemMainLeft}>{mainLeft}</Text>
                <Text style={styles.itemMainRight}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </Text>
              </View>
              {hasSubRow && (
                <View style={styles.itemSubRow}>
                  <Text style={styles.itemSubLeft}>{subLeft}</Text>
                  <Text style={styles.itemSubRight}>{exp.location}</Text>
                </View>
              )}
              {exp.responsibilities.map((line, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
              {exp.technologies.length > 0 && (
                <View style={styles.bullet}>
                  <Text style={styles.bulletDot} />
                  <Text style={[styles.bulletText, { fontStyle: "italic" }]}>
                    {exp.technologies.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }

  const renderSummary = () =>
    view.summary.trim() ? (
      <View style={styles.section} key="summary">
        <SectionTitle sectionKey="summary" />
        <Text>{view.summary}</Text>
      </View>
    ) : null;

  const renderExperience = () =>
    view.experienceGroups.length > 0 ? (
      <View style={styles.section} key="experience">
        {view.experienceGroups.length > 1 ? (
          view.experienceGroups.map((group) => (
            <View key={group.kindLabel} style={styles.group}>
              <View style={styles.sectionTitleBox}>
                <Text>
                  <Text style={styles.sectionTitleFirst}>
                    {group.kindLabel.charAt(0).toUpperCase()}
                  </Text>
                  <Text style={styles.sectionTitleRest}>
                    {group.kindLabel.slice(1).toUpperCase()}
                  </Text>
                </Text>
              </View>
              <ExperienceGroupBlock group={group} />
            </View>
          ))
        ) : (
          <>
            <SectionTitle sectionKey="experience" />
            <ExperienceGroupBlock group={view.experienceGroups[0]} />
          </>
        )}
      </View>
    ) : null;

  const renderEducation = () =>
    view.education.length > 0 ? (
      <View style={styles.section} key="education">
        <SectionTitle sectionKey="education" />
        {view.education.map((edu) => {
          const subLeft = [edu.degree, edu.faculty, edu.university]
            .filter(Boolean)
            .join(", ");
          const dateRange = formatDateRange(edu.startDate, edu.endDate, false);
          const cgpaText =
            edu.gradeValue != null
              ? edu.isPercentage
                ? ` | ${edu.gradeValue}%`
                : ` | CGPA: ${edu.gradeValue}${edu.gradeScale != null ? ` / ${edu.gradeScale}` : ""}`
              : "";
          return (
            <View key={edu.id} style={styles.item}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemMainLeft}>{edu.institution}</Text>
                <Text style={styles.itemMainRight}>{edu.location}</Text>
              </View>
              <View style={styles.itemSubRow}>
                <Text style={styles.itemSubLeft}>{subLeft}</Text>
                <Text style={styles.itemSubRight}>
                  {dateRange}
                  {cgpaText}
                </Text>
              </View>
              {edu.description && <Text>{edu.description}</Text>}
            </View>
          );
        })}
      </View>
    ) : null;

  const renderSkills = () =>
    view.skillGroups.length > 0 ? (
      <View style={styles.section} key="skills">
        <SectionTitle sectionKey="skills" />
        {view.skillGroups.map((group) => (
          <Text key={group.categoryLabel} style={styles.skillLine}>
            <Text style={styles.skillCategoryLabel}>
              {group.categoryLabel}:{" "}
            </Text>
            {group.items.map((s) => s.name).join(", ")}
          </Text>
        ))}
      </View>
    ) : null;

  const renderProjects = () =>
    view.projects.length > 0 ? (
      <View style={styles.section} key="projects">
        <SectionTitle sectionKey="projects" />
        {view.projects.map((project) => {
          const links = [
            project.website ? { label: "Website", href: project.website } : null,
            project.github ? { label: "GitHub", href: project.github } : null,
            project.playStore ? { label: "Play Store", href: project.playStore } : null,
          ].filter((l): l is { label: string; href: string } => l !== null);
          return (
            <View key={project.id} style={styles.item}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemMainLeft}>
                  {project.name}
                  {project.technologies.length > 0 && (
                    <Text style={{ fontStyle: "italic", fontWeight: 400 }}>
                      {"  |  "}
                      {project.technologies.join(", ")}
                    </Text>
                  )}
                </Text>
                {links.length > 0 && (
                  <Text style={styles.itemMainRight}>
                    {links.map((l, i) => (
                      <Text key={l.label}>
                        {i > 0 ? "  |  " : ""}
                        <Link src={l.href} style={styles.headerLink}>
                          {l.label}
                        </Link>
                      </Text>
                    ))}
                  </Text>
                )}
              </View>
              {project.description.map((line, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    ) : null;

  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
  };

  const { leftLines, rightLines } = buildHeaderColumns(view);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.headerRow, { marginBottom: t.sectionGap }]}>
          <View style={styles.headerLeftColumn}>
            <Text style={styles.headerName}>{view.profile.name}</Text>
            {leftLines.map((line, i) => (
              <Text key={i} style={styles.headerLeft}>
                {line.href ? (
                  <Link src={line.href} style={styles.headerLink}>
                    {line.text}
                  </Link>
                ) : (
                  line.text
                )}
              </Text>
            ))}
          </View>
          <View style={styles.headerRightColumn}>
            {rightLines.map((line, i) => (
              <Text key={i} style={styles.headerRight}>
                {line.href ? (
                  <Link src={line.href} style={styles.headerLink}>
                    {line.text}
                  </Link>
                ) : (
                  line.text
                )}
              </Text>
            ))}
          </View>
        </View>
        {view.sectionOrder.map((key) => sectionRenderers[key]())}
      </Page>
    </Document>
  );
}
