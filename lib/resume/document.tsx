import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeView, ResumeTier } from "./types";
import { TIER_STYLES } from "./types";

const PAGE_MARGIN = 28; // ~0.4in, minimal margin per design brief

function formatDateRange(start: string, end: string, current: boolean) {
  const endLabel = current ? "Present" : end;
  if (!start && !endLabel) return "";
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} – ${endLabel}`;
}

function contactLine(view: ResumeView) {
  const { profile, headerFields } = view;
  const parts: { label: string; href?: string }[] = [];
  if (headerFields.email && profile.email) {
    parts.push({ label: profile.email, href: `mailto:${profile.email}` });
  }
  if (headerFields.phone && profile.phone) {
    parts.push({ label: profile.phone });
  }
  if (headerFields.location && profile.location) {
    parts.push({ label: profile.location });
  }
  if (headerFields.website && profile.website) {
    parts.push({ label: profile.website, href: profile.website });
  }
  if (headerFields.github && profile.github) {
    parts.push({ label: profile.github, href: profile.github });
  }
  if (headerFields.linkedin && profile.linkedin) {
    parts.push({ label: profile.linkedin, href: profile.linkedin });
  }
  return parts;
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
      fontFamily: "Roboto",
      fontSize: t.baseFontSize,
      lineHeight: t.lineHeight,
      color: "#1a1a1a",
    },
    name: {
      fontSize: t.nameFontSize,
      fontWeight: 700,
      marginBottom: 2,
    },
    headline: {
      marginBottom: 4,
      color: "#333333",
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      fontSize: t.baseFontSize - 0.5,
      color: "#333333",
    },
    contactItem: {
      marginRight: 8,
    },
    link: {
      color: "#1a1a1a",
      textDecoration: "none",
    },
    section: {
      marginBottom: t.sectionGap,
    },
    sectionTitle: {
      fontSize: t.headingFontSize,
      fontWeight: 700,
      textTransform: "uppercase",
      borderBottomWidth: 1,
      borderBottomColor: "#1a1a1a",
      paddingBottom: 2,
      marginBottom: t.itemGap,
    },
    group: {
      marginBottom: t.itemGap,
    },
    groupLabel: {
      fontWeight: 600,
      marginBottom: t.bulletGap,
    },
    item: {
      marginBottom: t.itemGap,
    },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemTitle: {
      fontWeight: 600,
    },
    itemMeta: {
      fontStyle: "italic",
      color: "#333333",
    },
    bullet: {
      flexDirection: "row",
      marginBottom: t.bulletGap,
      paddingLeft: 10,
    },
    bulletDot: {
      width: 10,
    },
    bulletText: {
      flex: 1,
    },
    techLine: {
      fontStyle: "italic",
      color: "#333333",
      marginTop: 2,
    },
    skillLine: {
      marginBottom: t.bulletGap,
    },
    skillCategoryLabel: {
      fontWeight: 600,
    },
  });

  const contact = contactLine(view);

  const renderSummary = () =>
    view.summary.trim() ? (
      <View style={styles.section} key="summary">
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text>{view.summary}</Text>
      </View>
    ) : null;

  const renderExperience = () =>
    view.experienceGroups.length > 0 ? (
      <View style={styles.section} key="experience">
        <Text style={styles.sectionTitle}>Experience</Text>
        {view.experienceGroups.map((group) => (
          <View key={group.kindLabel} style={styles.group}>
            {view.experienceGroups.length > 1 && (
              <Text style={styles.groupLabel}>{group.kindLabel}</Text>
            )}
            {group.items.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {exp.title}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={styles.itemMeta}>{exp.location}</Text>
                )}
                {exp.responsibilities.map((line, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
                {exp.technologies.length > 0 && (
                  <Text style={styles.techLine}>
                    {exp.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    ) : null;

  const renderEducation = () =>
    view.education.length > 0 ? (
      <View style={styles.section} key="education">
        <Text style={styles.sectionTitle}>Education</Text>
        {view.education.map((edu) => (
          <View key={edu.id} style={styles.item}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemTitle}>
                {edu.degree} — {edu.institution}
              </Text>
              <Text style={styles.itemMeta}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </Text>
            </View>
            {(edu.university || edu.faculty || edu.location) && (
              <Text style={styles.itemMeta}>
                {[edu.faculty, edu.university, edu.location]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
            {edu.cgpa != null && (
              <Text>
                CGPA: {edu.cgpa}
                {edu.cgpaScale != null ? ` / ${edu.cgpaScale}` : ""}
              </Text>
            )}
            {edu.description && <Text>{edu.description}</Text>}
          </View>
        ))}
      </View>
    ) : null;

  const renderSkills = () =>
    view.skillGroups.length > 0 ? (
      <View style={styles.section} key="skills">
        <Text style={styles.sectionTitle}>Skills</Text>
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
        <Text style={styles.sectionTitle}>Projects</Text>
        {view.projects.map((project) => {
          const link = project.website || project.github || project.playStore;
          return (
            <View key={project.id} style={styles.item}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                {link && (
                  <Link src={link} style={styles.link}>
                    <Text style={styles.itemMeta}>{link}</Text>
                  </Link>
                )}
              </View>
              {project.technologies.length > 0 && (
                <Text style={styles.techLine}>
                  {project.technologies.join(", ")}
                </Text>
              )}
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{view.profile.name}</Text>
        {view.profile.headline && (
          <Text style={styles.headline}>{view.profile.headline}</Text>
        )}
        <View style={[styles.contactRow, { marginBottom: t.sectionGap }]}>
          {contact.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                src={item.href}
                style={[styles.link, styles.contactItem]}
              >
                <Text>{item.label}</Text>
              </Link>
            ) : (
              <Text key={i} style={styles.contactItem}>
                {item.label}
              </Text>
            ),
          )}
        </View>
        {view.sectionOrder.map((key) => sectionRenderers[key]())}
      </Page>
    </Document>
  );
}
