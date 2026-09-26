import { useState } from "react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader } from "lucide-react";

interface AiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!value.trim()) return;

    setIsLoading(true);
    // Add decorative 3D engraved symbol placeholder
    setTimeout(() => {
      editor?.addText(`✨ ${value}`, {
        fontSize: 36,
        fill: "#f6d365"
      });
      setValue("");
      setIsLoading(false);
    }, 600);
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "ai" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="AI Assistant"
        description="Generate typography and design accents with AI"
      />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-6">
          <Textarea
            disabled={isLoading}
            placeholder="উদাহরণ: গোল্ডেন ক্যালিগ্রাফি নেমপ্লেট টাইটেল অথবা ফ্লোরাল ফ্রেম..."
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-[#8b3dff] hover:bg-[#7828e8]"
          >
            {isLoading ? <Loader className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            জেনারেট করুন
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
