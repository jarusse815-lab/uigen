import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getToolLabel } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create returns filename", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/components/Card.tsx" }))
    .toBe("Creating Card.tsx");
});

test("getToolLabel: str_replace_editor create without path returns generic message", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" }))
    .toBe("Creating file");
});

test("getToolLabel: str_replace_editor str_replace returns editing message", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.tsx" }))
    .toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor insert returns editing message", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/index.ts" }))
    .toBe("Editing index.ts");
});

test("getToolLabel: file_manager rename shows both filenames", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }))
    .toBe("Renaming Old.tsx → New.tsx");
});

test("getToolLabel: file_manager rename without new_path omits arrow", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/Old.tsx" }))
    .toBe("Renaming Old.tsx");
});

test("getToolLabel: file_manager delete returns filename", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/Unused.tsx" }))
    .toBe("Deleting Unused.tsx");
});

test("getToolLabel: unknown tool returns tool name", () => {
  expect(getToolLabel("some_unknown_tool", {})).toBe("some_unknown_tool");
});

// --- ToolInvocationBadge rendering tests ---

test("shows label and spinner when not yet complete", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        toolCallId: "1",
        args: { command: "create", path: "src/Button.tsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("shows label and green dot when complete", () => {
  const { container } = render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        toolCallId: "2",
        args: { command: "str_replace", path: "src/Card.tsx" },
        state: "result",
        result: "OK",
      }}
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
});

test("shows spinner (not green dot) when result is null", () => {
  const { container } = render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        toolCallId: "3",
        args: { command: "create", path: "src/Form.tsx" },
        state: "result",
        result: null,
      }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "mystery_tool",
        toolCallId: "4",
        args: {},
        state: "call",
      }}
    />
  );
  expect(screen.getByText("mystery_tool")).toBeDefined();
});
