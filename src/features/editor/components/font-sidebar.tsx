import { 
  ActiveTool, 
  Editor,
  fonts, 
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const value = editor?.getActiveFontFamily();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "font" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Font"
        description="Change the text font"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="lg"
              className={cn(
                "w-full h-16 justify-between text-left items-center",
                value === font && "border-2 border-[#0073ff] bg-[#f0f7ff]",
              )}
              style={{
                fontSize: "15px",
                padding: "8px 16px"
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {font === "SutonnyMJ" ? "SutonnyMJ (বিজয় ANSI)" : font === "SushreeMJ" ? "SushreeMJ (ইটালিক)" : font}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {font === "SutonnyMJ" ? "ইউনিকোড থেকে অটো রূপান্তর" : "Standard Font"}
                </span>
              </div>
              <span
                style={{ fontFamily: font }}
                className="text-lg text-neutral-800"
              >
                {font === "SutonnyMJ" ? "Avwg evsjvq MvB" : "Ag"}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
