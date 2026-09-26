import Image from "next/image";
import { Upload, Sparkles, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PRESET_ICONS = [
  { 
    name: "গোল্ডেন ফ্রেম প্যাটার্ন (PNG)", 
    url: "/templates/golden-frame-border.png",
    isTransparentPng: true,
  },
  { name: "মিনার / আর্চ", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60" },
  { name: "ফুলের মোটিফ", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60" },
  { name: "মার্বেল টেক্সচার", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60" },
  { name: "গোল্ডেন ফয়েল", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60" }
];

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({ editor, activeTool, onChangeActiveTool }: ImageSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          editor?.addImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="ছবি ও মোটিফ" description="নেমপ্লেটে ছবি বা লোগো যোগ করুন" />
      <div className="p-4 border-b">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-[#8b3dff] hover:bg-[#7828e8] text-white flex items-center justify-center gap-2"
        >
          <Upload className="size-4" />
          ছবি আপলোড করুন (Upload Image)
        </Button>
      </div>

      <ScrollArea>
        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold text-neutral-500">প্রস্তাবিত টেক্সচার ও মোটিফ:</p>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_ICONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => editor?.addImage(item.url)}
                className={cn(
                  "relative w-full h-[90px] group hover:opacity-85 transition rounded-lg overflow-hidden border border-neutral-200 cursor-pointer",
                  item.isTransparentPng ? "bg-neutral-900 p-1" : "bg-neutral-100"
                )}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className={cn(
                    "w-full h-full",
                    item.isTransparentPng ? "object-contain" : "object-cover"
                  )}
                />
                <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-white text-[10px] font-medium truncate text-center">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
