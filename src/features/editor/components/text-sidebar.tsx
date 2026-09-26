import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Text"
        description="Add text to your canvas"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full"
            onClick={() => editor?.addText("Textbox")}
          >
            Add a textbox
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Heading", {
              fontSize: 80,
              fontWeight: 700,
            })}
          >
            <span className="text-3xl font-bold">
              Add a heading
            </span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Subheading", {
              fontSize: 44,
              fontWeight: 600,
            })}
          >
            <span className="text-xl font-semibold">
              Add a subheading
            </span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Paragraph", {
              fontSize: 32,
            })}
          >
            Paragraph
          </Button>
          <div className="pt-2">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              বাংলা ফন্ট (SutonnyMJ ANSI)
            </div>
            <Button
              className="w-full h-16 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 hover:bg-purple-100 text-purple-900 justify-between px-4"
              variant="outline"
              size="lg"
              onClick={() => editor?.addText("রহমান ভিলা", {
                fontFamily: "SutonnyMJ",
                fontSize: 64,
                fontWeight: 700,
              })}
            >
              <div className="flex flex-col text-left">
                <span className="font-bold text-base">বাংলা নেমপ্লেট (সুতোন্বী)</span>
                <span className="text-[11px] text-purple-700">ইউনিকোড টাইপ করলে অটো সুতোন্বী হবে</span>
              </div>
              <span className="text-2xl font-bold font-['SutonnyMJ']">
                ingvb wfjv
              </span>
            </Button>
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
