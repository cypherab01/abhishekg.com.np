"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, RefreshCw } from "lucide-react";
import type {
  Education,
  Project,
  ResumeConfig,
  ResumeHeaderField,
  ResumeSection,
  ResumeSectionKey,
} from "@/db/schema";
import { saveResumeConfig } from "../actions";
import { Card } from "../_components/ui";
import { SubmitButton } from "../_components/submit-button";

type ExperienceGroup = {
  id: number;
  label: string;
  items: {
    id: number;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    responsibilities: string[];
  }[];
};

type SkillGroup = {
  id: number;
  label: string;
  items: { id: number; name: string }[];
};

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
};

const HEADER_FIELD_LABELS: Record<ResumeHeaderField, string> = {
  phone: "Phone",
  email: "Email",
  website: "Website",
  github: "GitHub",
  linkedin: "LinkedIn",
  location: "Location",
};

function experienceLabel(item: ExperienceGroup["items"][number]) {
  const range = `${item.startDate}–${item.current ? "Present" : item.endDate}`;
  return item.company
    ? `${item.title} — ${item.company} (${range})`
    : `${item.title} (${range})`;
}

function educationLabel(item: Education) {
  return `${item.degree} — ${item.institution} (${item.startDate}–${item.endDate})`;
}

function initLineSelections<T extends { id: number }>(
  items: T[],
  getLines: (item: T) => string[],
  saved: Record<string, number[]>,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  for (const item of items) {
    const savedIndices = saved[String(item.id)];
    const allIndices = getLines(item).map((_, i) => i);
    map.set(item.id, new Set(savedIndices ?? allIndices));
  }
  return map;
}

/**
 * Omits ids where every line is still selected, so a resume config saved
 * before a new bullet was added keeps including that new bullet by default
 * — only explicit deselections get persisted.
 */
function serializeLineSelections<T extends { id: number }>(
  items: T[],
  getLines: (item: T) => string[],
  selections: Map<number, Set<number>>,
): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  for (const item of items) {
    const total = getLines(item).length;
    const selected = selections.get(item.id) ?? new Set(getLines(item).map((_, i) => i));
    if (selected.size >= total) continue;
    result[String(item.id)] = Array.from(selected).sort((a, b) => a - b);
  }
  return result;
}

function LineChecklist({
  itemId,
  lines,
  selections,
  onToggle,
}: {
  itemId: number;
  lines: string[];
  selections: Map<number, Set<number>>;
  onToggle: (itemId: number, lineIndex: number) => void;
}) {
  if (lines.length === 0) return null;
  const selected = selections.get(itemId);
  return (
    <div className="ml-6 space-y-1 border-l border-border pl-3">
      {lines.map((line, i) => (
        <label
          key={i}
          className="flex items-start gap-2 text-xs text-muted-foreground"
        >
          <input
            type="checkbox"
            className="mt-0.5 size-3.5 shrink-0 accent-primary"
            checked={selected?.has(i) ?? true}
            onChange={() => onToggle(itemId, i)}
          />
          <span>{line}</span>
        </label>
      ))}
    </div>
  );
}

function SortableSectionRow({
  section,
  onToggle,
}: {
  section: ResumeSection;
  onToggle: (key: ResumeSectionKey) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.key });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground"
        aria-label={`Reorder ${SECTION_LABELS[section.key]}`}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 text-sm font-medium text-foreground">
        {SECTION_LABELS[section.key]}
      </span>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={section.visible}
          onChange={() => onToggle(section.key)}
        />
        Visible
      </label>
    </div>
  );
}

export function ResumeBuilder({
  config,
  experienceGroups,
  education,
  skillGroups,
  projects,
}: {
  config: ResumeConfig;
  experienceGroups: ExperienceGroup[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
}) {
  const [summary, setSummary] = useState(config.summary);
  const [sections, setSections] = useState<ResumeSection[]>(config.sections);
  const [headerFields, setHeaderFields] = useState(config.headerFields);
  const [experienceIds, setExperienceIds] = useState(
    new Set<number>(config.experienceIds),
  );
  const [educationIds, setEducationIds] = useState(
    new Set<number>(config.educationIds),
  );
  const [skillIds, setSkillIds] = useState(new Set<number>(config.skillIds));
  const [projectIds, setProjectIds] = useState(
    new Set<number>(config.projectIds),
  );
  const allExperienceItems = useMemo(
    () => experienceGroups.flatMap((g) => g.items),
    [experienceGroups],
  );
  const [experienceLines, setExperienceLines] = useState(() =>
    initLineSelections(
      allExperienceItems,
      (item) => item.responsibilities,
      config.experienceLineIndices,
    ),
  );
  const [projectLines, setProjectLines] = useState(() =>
    initLineSelections(
      projects,
      (project) => project.description,
      config.projectLineIndices,
    ),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const configPayload = useMemo(
    () => ({
      summary,
      sections,
      headerFields,
      experienceIds: Array.from(experienceIds),
      educationIds: Array.from(educationIds),
      skillIds: Array.from(skillIds),
      projectIds: Array.from(projectIds),
      experienceLineIndices: serializeLineSelections(
        allExperienceItems,
        (item) => item.responsibilities,
        experienceLines,
      ),
      projectLineIndices: serializeLineSelections(
        projects,
        (project) => project.description,
        projectLines,
      ),
    }),
    [
      summary,
      sections,
      headerFields,
      experienceIds,
      educationIds,
      skillIds,
      projectIds,
      experienceLines,
      projectLines,
      allExperienceItems,
      projects,
    ],
  );

  function toggleSet(
    set: Set<number>,
    id: number,
    setter: (next: Set<number>) => void,
  ) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  function toggleLine(
    map: Map<number, Set<number>>,
    setter: (next: Map<number, Set<number>>) => void,
    totalLinesByItemId: Map<number, number>,
  ) {
    return (itemId: number, lineIndex: number) => {
      const next = new Map(map);
      const total = totalLinesByItemId.get(itemId) ?? 0;
      const current = new Set(
        next.get(itemId) ?? Array.from({ length: total }, (_, i) => i),
      );
      if (current.has(lineIndex)) current.delete(lineIndex);
      else current.add(lineIndex);
      next.set(itemId, current);
      setter(next);
    };
  }

  const experienceLineTotals = useMemo(
    () =>
      new Map(allExperienceItems.map((item) => [item.id, item.responsibilities.length])),
    [allExperienceItems],
  );
  const projectLineTotals = useMemo(
    () => new Map(projects.map((project) => [project.id, project.description.length])),
    [projects],
  );
  const handleToggleExperienceLine = toggleLine(
    experienceLines,
    setExperienceLines,
    experienceLineTotals,
  );
  const handleToggleProjectLine = toggleLine(
    projectLines,
    setProjectLines,
    projectLineTotals,
  );

  function toggleSection(key: ResumeSectionKey) {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)),
    );
  }

  function toggleHeaderField(field: ResumeHeaderField) {
    setHeaderFields((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.key === active.id);
      const newIndex = prev.findIndex((s) => s.key === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  async function handlePreview() {
    setIsPreviewing(true);
    setPreviewError(null);
    try {
      const res = await fetch("/api/resume/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configPayload),
      });
      if (!res.ok) {
        throw new Error(`Preview failed (${res.status})`);
      }
      const blob = await res.blob();
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setIsPreviewing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
      <form action={saveResumeConfig} className="space-y-6">
        <input type="hidden" name="config" value={JSON.stringify(configPayload)} />

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Resume summary</p>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Header fields</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.keys(HEADER_FIELD_LABELS) as ResumeHeaderField[]).map(
              (field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={headerFields[field]}
                    onChange={() => toggleHeaderField(field)}
                  />
                  {HEADER_FIELD_LABELS[field]}
                </label>
              ),
            )}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Sections</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.key)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sections.map((section) => (
                  <SortableSectionRow
                    key={section.key}
                    section={section}
                    onToggle={toggleSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Experience</p>
          {experienceGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={experienceIds.has(item.id)}
                      onChange={() =>
                        toggleSet(experienceIds, item.id, setExperienceIds)
                      }
                    />
                    {experienceLabel(item)}
                  </label>
                  <LineChecklist
                    itemId={item.id}
                    lines={item.responsibilities}
                    selections={experienceLines}
                    onToggle={handleToggleExperienceLine}
                  />
                </div>
              ))}
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Education</p>
          {education.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={educationIds.has(item.id)}
                onChange={() => toggleSet(educationIds, item.id, setEducationIds)}
              />
              {educationLabel(item)}
            </label>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Skills</p>
          {skillGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={skillIds.has(item.id)}
                      onChange={() => toggleSet(skillIds, item.id, setSkillIds)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">Projects</p>
          {projects.map((project) => (
            <div key={project.id} className="space-y-1">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={projectIds.has(project.id)}
                  onChange={() => toggleSet(projectIds, project.id, setProjectIds)}
                />
                {project.name}
              </label>
              <LineChecklist
                itemId={project.id}
                lines={project.description}
                selections={projectLines}
                onToggle={handleToggleProjectLine}
              />
            </div>
          ))}
        </Card>

        <SubmitButton label="Save settings" />
      </form>

      <div className="lg:sticky lg:top-20 space-y-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
        >
          {isPreviewing ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Eye className="size-4" />
          )}
          {isPreviewing ? "Rendering..." : "Preview"}
        </button>
        {previewError && (
          <p className="text-sm text-destructive">{previewError}</p>
        )}
        <Card className="h-[70vh] overflow-hidden">
          {previewUrl ? (
            <iframe src={previewUrl} className="h-full w-full" title="Resume preview" />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              Click Preview to render the resume with your current selections.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
