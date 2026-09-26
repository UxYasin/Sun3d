import { useState, useEffect } from "react";
import { ActiveTool, Editor, BevelEmbossConfig } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface BevelEmbossSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const BevelEmbossSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: BevelEmbossSidebarProps) => {
  const activeConfig = editor?.getActiveBevelEmboss() || {
    enabled: true,
    style: "inner-bevel",
    technique: "smooth",
    depth: 215,
    size: 10,
    soften: 1,
    angle: 90,
    altitude: 30,
    highlightColor: "#ffffff",
    highlightOpacity: 0.5,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
  };

  const [config, setConfig] = useState<BevelEmbossConfig>(activeConfig);

  useEffect(() => {
    if (editor?.selectedObjects[0]) {
      setConfig(editor.getActiveBevelEmboss());
    }
  }, [editor?.selectedObjects]);

  const updateConfig = (updates: Partial<BevelEmbossConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    editor?.changeBevelEmboss(updates);
  };

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
        title="Bevel & Emboss (৩ডি বেভেল)"
        description="ফটোশপ স্টাইল ৩ডি বেভেল ও এমবস ইফেক্ট কনফিগার করুন"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5 text-sm">
          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/60 border border-purple-200/80">
            <div className="space-y-0.5">
              <Label className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="size-4 text-[#8b3dff]" />
                Bevel and Emboss
              </Label>
              <p className="text-[11px] text-neutral-500">
                বাংলা হরফে ৩ডি ডেপথ ও এমবস অন/অফ করুন
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig({ enabled: !config.enabled })}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                config.enabled ? "bg-[#8b3dff]" : "bg-neutral-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  config.enabled ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {config.enabled && (
            <>
              {/* Structure section */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Structure (কাঠামো)
                </div>

                {/* Style */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">Style</Label>
                  <select
                    value={config.style}
                    onChange={(e) => updateConfig({ style: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#8b3dff]"
                  >
                    <option value="inner-bevel">Inner Bevel (ইনার বেভেল)</option>
                    <option value="outer-bevel">Outer Bevel (আউটার বেভেল)</option>
                    <option value="emboss">Emboss (এমবস)</option>
                  </select>
                </div>

                {/* Technique */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">Technique</Label>
                  <select
                    value={config.technique}
                    onChange={(e) => updateConfig({ technique: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#8b3dff]"
                  >
                    <option value="smooth">Smooth (মসৃণ)</option>
                    <option value="chisel-hard">Chisel Hard (শার্প খোদাই)</option>
                  </select>
                </div>

                {/* Depth */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-neutral-700">Depth (গভীরতা)</Label>
                    <span className="font-mono text-neutral-500 font-bold">{config.depth}%</span>
                  </div>
                  <Slider
                    value={[config.depth]}
                    min={50}
                    max={500}
                    step={5}
                    onValueChange={([val]) => updateConfig({ depth: val })}
                  />
                </div>

                {/* Size */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-neutral-700">Size (আকার)</Label>
                    <span className="font-mono text-neutral-500 font-bold">{config.size} px</span>
                  </div>
                  <Slider
                    value={[config.size]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={([val]) => updateConfig({ size: val })}
                  />
                </div>

                {/* Soften */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-neutral-700">Soften (কোমলতা)</Label>
                    <span className="font-mono text-neutral-500 font-bold">{config.soften} px</span>
                  </div>
                  <Slider
                    value={[config.soften]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={([val]) => updateConfig({ soften: val })}
                  />
                </div>
              </div>

              {/* Shading section */}
              <div className="space-y-3 pt-3 border-t">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Shading (ছায়া ও আলো)
                </div>

                {/* Angle */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-neutral-700">Angle (আলোর কোণ)</Label>
                    <span className="font-mono text-neutral-500 font-bold">{config.angle}°</span>
                  </div>
                  <Slider
                    value={[config.angle]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={([val]) => updateConfig({ angle: val })}
                  />
                </div>

                {/* Shadow Opacity */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-neutral-700">Shadow Opacity (ছায়ার ঘনত্ব)</Label>
                    <span className="font-mono text-neutral-500 font-bold">
                      {Math.round(config.shadowOpacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[config.shadowOpacity * 100]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={([val]) => updateConfig({ shadowOpacity: val / 100 })}
                  />
                </div>

                {/* Highlight and Shadow Color Palette */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-neutral-600">Highlight (আলো)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.highlightColor || "#ffffff"}
                        onChange={(e) => updateConfig({ highlightColor: e.target.value })}
                        className="w-7 h-7 rounded border border-neutral-300 cursor-pointer p-0.5"
                      />
                      <span className="font-mono text-[11px] text-neutral-500">{config.highlightColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-neutral-600">Shadow (ছায়া)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.shadowColor || "#000000"}
                        onChange={(e) => updateConfig({ shadowColor: e.target.value })}
                        className="w-7 h-7 rounded border border-neutral-300 cursor-pointer p-0.5"
                      />
                      <span className="font-mono text-[11px] text-neutral-500">{config.shadowColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
