import { Message } from "@/types/chat";

export function messagesToMarkdown(messages: Message[]): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let md = `# Agent Debate Consensus\n\n**Exported:** ${dateStr}\n\n---\n\n`;

  for (const msg of messages) {
    const time = new Date(msg.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (msg.role === "system") {
      md += `> *[${time}] ${msg.content}*\n\n`;
      continue;
    }

    const author = msg.role === "user" ? "You (Moderator)" : (msg.modelName || "Agent");

    md += `### ${author}\n`;
    md += `*${time}*\n\n`;

    if (msg.reasoning) {
      md += `> **Thinking:** ${msg.reasoning}\n\n`;
    }

    md += `${msg.content}\n`;
    if (msg.attachment) {
      md += `\n📎 **${msg.attachment.fileName}** (${(msg.attachment.size / 1024).toFixed(1)} KB)\n\n\`\`\`\n${msg.attachment.content}\n\`\`\`\n`;
    }
    md += `\n---\n\n`;
  }

  return md;
}

export function messageToMarkdown(message: Message): string {
  const author = message.role === "user" ? "You" : (message.modelName || "Agent");
  let md = `**${author}:**\n\n`;

  if (message.reasoning) {
    md += `> **Thinking:** ${message.reasoning}\n\n`;
  }

  md += message.content;
  if (message.attachment) {
    md += `\n\n📎 **${message.attachment.fileName}** (${(message.attachment.size / 1024).toFixed(1)} KB)\n\n\`\`\`\n${message.attachment.content}\n\`\`\``;
  }
  return md;
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
