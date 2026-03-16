import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

interface ToolInvocationBadgeProps {
  tool: ToolInvocation;
}

function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const filename = (path: unknown) =>
    typeof path === "string" ? path.split("/").pop() ?? path : null;

  if (toolName === "str_replace_editor") {
    const name = filename(args.path);
    switch (args.command) {
      case "create":
        return name ? `Creating ${name}` : "Creating file";
      case "str_replace":
      case "insert":
        return name ? `Editing ${name}` : "Editing file";
    }
  }

  if (toolName === "file_manager") {
    const name = filename(args.path);
    switch (args.command) {
      case "rename": {
        const newName = filename(args.new_path);
        return name
          ? `Renaming ${name}${newName ? ` → ${newName}` : ""}`
          : "Renaming file";
      }
      case "delete":
        return name ? `Deleting ${name}` : "Deleting file";
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ tool }: ToolInvocationBadgeProps) {
  const label = getToolLabel(tool.toolName, tool.args);
  const isDone = tool.state === "result" && tool.result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}

export { getToolLabel };
