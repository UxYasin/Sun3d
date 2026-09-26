"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import {
  ActiveTool,
  BevelEmbossConfig,
  Editor,
} from "@/features/editor/types";
import { DEFAULT_BEVEL_EMBOSS } from "@/features/editor/bevel-emboss";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface BevelEmbossSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const SliderRow = ({
  label,
  hint,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  onCommit,
}: {
  label: string;
  hint: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onCommit: () => void;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-xs">
      <Label className="font-semibold text-neutral-700">
        {label} <span className="text-neutral-400 font-normal">{hint}</span>
      </Label>
      <span className="font-mono text-neutral-500 font-bold">{display}</span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([next]) => onChange(next)}
      onValueCommit={() => onCommit()}
    />
  </div>
);

export const BevelEmbossSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: BevelEmbossSidebarProps) => {
  // The panel is keyed on the active object, so this initial read is correct
  // for the current selection.
  const [config, setConfig] = useState<BevelEmbossConfig>(
    editor?.getActiveBevelEmboss() || DEFAULT_BEVEL_EMBOSS
  );

  // Live preview: every move repaints the canvas. `commit` writes a single
  // history/save step, so dragging doesn't flood the undo stack.
  const update = (updates: Partial<BevelEmbossConfig>, commit = false) => {
    setConfig((current) => ({ ...current, ...updates }));
    editor?.changeBevelEmboss(updates, commit);
  };

  const commit = () => editor?.changeBevelEmboss({}, true);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "bevel-emboss" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Bevel & Emboss (বেভেল ও এমবস)"
        description="Inner bevel সামঞ্জস্য করুন — পরিবর্তন সাথে সাথেই ক্যানভাসে দেখা যাবে"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <Label className="font-bold text-neutral-900">Bevel &amp; Emboss</Label>
              <p className="text-[11px] text-neutral-500">
                নির্বাচিত লেয়ারে ইফেক্ট চালু/বন্ধ করুন
              </p>
            </div>
            <button
              type="button"
              onClick={() => update({ enabled: !config.enabled }, true)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                config.enabled ? "bg-[#0073ff]" : "bg-neutral-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200",
                  config.enabled ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {config.enabled && (
            <>
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Style (ধরন)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "emboss", label: "Inner Bevel" },
                      { value: "engrave", label: "Engrave" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update({ mode: option.value }, true)}
                      className={cn(
                        "h-9 rounded-lg border text-xs font-semibold transition",
                        config.mode === option.value
                          ? "border-[#0073ff] bg-[#f0f7ff] text-[#0073ff]"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Structure (কাঠামো)
                </div>

                <SliderRow
                  label="Size"
                  hint="(আকার)"
                  value={config.size}
                  display={`${config.size} px`}
                  min={1}
                  max={60}
                  onChange={(size) => update({ size })}
                  onCommit={commit}
                />
                <SliderRow
                  label="Soften"
                  hint="(কোমলতা)"
                  value={config.soften}
                  display={`${config.soften} px`}
                  min={0}
                  max={10}
                  onChange={(soften) => update({ soften })}
                  onCommit={commit}
                />
                <SliderRow
                  label="Depth"
                  hint="(গভীরতা)"
                  value={config.depth}
                  display={`${config.depth}%`}
                  min={1}
                  max={300}
                  onChange={(depth) => update({ depth })}
                  onCommit={commit}
                />
              </div>

              <div className="space-y-4 pt-3 border-t">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Shading (আলো ও ছায়া)
                </div>

                <SliderRow
                  label="Angle"
                  hint="(আলোর কোণ)"
                  value={config.angle}
                  display={`${config.angle}°`}
                  min={0}
                  max={360}
                  step={5}
                  onChange={(angle) => update({ angle })}
                  onCommit={commit}
                />
                <SliderRow
                  label="Altitude"
                  hint="(উচ্চতা)"
                  value={config.altitude}
                  display={`${config.altitude}°`}
                  min={1}
                  max={89}
                  onChange={(altitude) => update({ altitude })}
                  onCommit={commit}
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-neutral-600">
                      Highlight (আলো)
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.highlightColor}
                        onChange={(e) =>
                          update({ highlightColor: e.target.value })
                        }
                        onBlur={commit}
                        className="w-8 h-8 rounded border border-neutral-300 cursor-pointer p-0.5"
                      />
                      <span className="font-mono text-[11px] text-neutral-500">
                        {config.highlightColor}
                      </span>
                    </div>
                    <Slider
                      value={[Math.round(config.highlightOpacity * 100)]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => update({ highlightOpacity: v / 100 })}
                      onValueCommit={commit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-neutral-600">
                      Shadow (ছায়া)
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.shadowColor}
                        onChange={(e) => update({ shadowColor: e.target.value })}
                        onBlur={commit}
                        className="w-8 h-8 rounded border border-neutral-300 cursor-pointer p-0.5"
                      />
                      <span className="font-mono text-[11px] text-neutral-500">
                        {config.shadowColor}
                      </span>
                    </div>
                    <Slider
                      value={[Math.round(config.shadowOpacity * 100)]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => update({ shadowOpacity: v / 100 })}
                      onValueCommit={commit}
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => update({ ...DEFAULT_BEVEL_EMBOSS }, true)}
              >
                <RotateCcw className="size-4 mr-2" />
                Reset to default (ডিফল্ট)
              </Button>
            </>
          )}
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
