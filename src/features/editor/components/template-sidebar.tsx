import { Crown } from "lucide-react";

import { 
  ActiveTool, 
  Editor,
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { MOCK_TEMPLATES } from "@/data/mock-templates";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "টেমপ্লেট পরিবর্তন নিশ্চিত করুন",
    "বর্তমান ক্যানভাসে এই টেমপ্লেটটি লোড করতে চান?"
  );

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: typeof MOCK_TEMPLATES[0]) => {
    const ok = await confirm();
    if (!ok || !editor) return;

    // Ensure SutonnyMJ font is loaded before rendering canvas objects
    try {
      if (document.fonts) {
        await document.fonts.load("48px SutonnyMJ");
        await document.fonts.load("bold 48px SutonnyMJ");
      }
    } catch (e) {
      console.warn("Font loading error:", e);
    }

    // Clear previous objects (except workspace clip)
    const objects = editor.canvas.getObjects().slice();
    objects.forEach((obj) => {
      if (obj.name !== "clip") {
        editor.canvas.remove(obj);
      }
    });

    // Check if this is a 2:1 frame template
    const isTwoToOne = template.supportedSizes.includes("4:2");
    if (isTwoToOne) {
      editor.changeSize({ width: 1200, height: 600 });
    }

    // Set background color
    editor.changeBackground(template.style.background);

    // If template has a texture overlay (like the golden frame border), add it as a selectable, resizable frame pattern in the background
    if (template.style.textureOverlay) {
      editor.addImage(template.style.textureOverlay, {
        sendToBack: true,
      });
    }

    if (template.id.startsWith("tpl-royal-frame")) {
      // 1. Top Bismillah (সোনালী বিসমিল্লাহির রাহমানির রাহিম)
      editor.addText(template.defaultValues.holdingNumber, {
        width: 1000,
        left: 100,
        top: 60,
        textAlign: "center",
        fontSize: 30,
        fontFamily: "SutonnyMJ",
        fontWeight: 600,
        fill: "#f5d061",
      });

      // 2. Main House Name (সামিউল হাসান ভবন) - Size 150, ScaleY 125%
      editor.addText(template.defaultValues.houseName, {
        width: 1000,
        left: 100,
        top: 105,
        textAlign: "center",
        fontSize: 150,
        fontFamily: "SutonnyMJ",
        fontWeight: 700,
        fill: "#f5d061",
        scaleY: 1.25,
      });

      // 3. Proprietor (প্রোঃ শাহ আলম) - Size 120, ScaleX 115%
      editor.addText(template.defaultValues.proprietor, {
        width: 1000,
        left: 100,
        top: 275,
        textAlign: "center",
        fontSize: 120,
        fontFamily: "SutonnyMJ",
        fontWeight: 700,
        fill: "#f5d061",
        scaleX: 1.15,
      });

      // 4. Father line (পিতাঃ মৃত হারুন অর রশিদ) - Size 60, Bold
      editor.addText("wcZvt g…Z nvi“b Ai iwk`", {
        width: 1000,
        left: 100,
        top: 420,
        textAlign: "center",
        fontSize: 60,
        fontFamily: "SutonnyMJ",
        fontWeight: 700,
        fill: "#f5d061",
      });

      // 5. Village / Address line (গ্রামঃ দড়িহাইরমারা, রায়পুরা, নরসিংদী।) - Size 46
      editor.addText("Mªvgt `wonvBigviv, ivqcyiv, biwms`x|", {
        width: 1000,
        left: 100,
        top: 495,
        textAlign: "center",
        fontSize: 46,
        fontFamily: "SutonnyMJ",
        fontWeight: 600,
        fill: "#f5d061",
      });

      editor.canvas.discardActiveObject();
      editor.canvas.renderAll();
    } else {
      // Add standard template sample texts
      editor.addText(template.defaultValues.houseName, {
        fontSize: 56,
        fontFamily: template.textConfig.houseName.fontFamily === "serif" ? "Times New Roman" : "Arial",
        fontWeight: 700,
        fill: template.textConfig.houseName.color || "#f6d365",
        top: 200,
        left: 150,
      });

      editor.addText(template.defaultValues.proprietor, {
        fontSize: 32,
        fontFamily: "Arial",
        fontWeight: 600,
        fill: template.textConfig.proprietor.color || "#e2e8f0",
        top: 300,
        left: 150,
      });

      editor.addText(`${template.defaultValues.holdingNumber} • ${template.defaultValues.address}`, {
        fontSize: 24,
        fontFamily: "Arial",
        fontWeight: 400,
        fill: "#94a3b8",
        top: 380,
        left: 150,
      });
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[380px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="নেমপ্লেট টেমপ্লেট"
        description="প্রস্তুতকৃত প্রিমিয়াম ৩ডি নেমপ্লেট ডিজাইন নির্বাচন করুন"
      />
      <ScrollArea>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2.5">
            {MOCK_TEMPLATES.map((template) => {
              return (
                <button
                  key={template.id}
                  onClick={() => onClick(template)}
                  className="w-full text-left p-2 rounded-xl border border-neutral-200 hover:border-[#8b3dff] bg-neutral-50/50 hover:bg-[#faf5ff] transition group cursor-pointer overflow-hidden flex flex-col"
                >
                  {template.thumbnail && (
                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-2 border border-neutral-200/80 bg-neutral-900 shadow-sm">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-neutral-900 group-hover:text-[#8b3dff] line-clamp-1">
                      {template.name.replace(/রয়্যাল গোল্ডেন ফ্রেম — /, '')}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600 shrink-0">
                      2:1
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-bold text-[#8b3dff]">
                    ৳{template.priceStartingAt.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
