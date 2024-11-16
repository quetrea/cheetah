import { TaskStatus } from "@/features/tasks/types";
import { client } from "./rpc";
import { WebhookEvent } from "@/features/webhooks/types";
import crypto from "crypto";

// Webhook mesaj tipini güncelle
interface DiscordWebhookMessage {
  title: string;
  description: string;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  color?: number; // Discord için decimal renk kodu
}

// TaskStatus için renk mapping'i ekle
export const statusColors = {
  [TaskStatus.TODO]: 0xdc2626, // Domates kırmızısı
  [TaskStatus.IN_PROGRESS]: 0xfacc15, // Sarı (yellow-400)
  [TaskStatus.IN_REVIEW]: 0x3b82f6, // Mavi (blue-500)
  [TaskStatus.DONE]: 0x10b981, // Yeşil
  [TaskStatus.BACKLOG]: 0xec4899, // Pembe
} as const;

export async function triggerWebhooks<T>(
  workspaceId: string,
  event: WebhookEvent,
  data: T
) {
  try {
    console.log("Triggering webhooks for:", { workspaceId, event });

    const response = await client.api.webhooks.$get(
      {
        query: { workspaceId },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("session")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch webhooks: ${response.status}`);
    }

    const { data: webhooks } = await response.json();
    console.log("Found webhooks:", webhooks?.documents);

    // İlgili event'e sahip webhook'ları filtrele ve tetikle
    const activeWebhooks = webhooks.documents.filter(
      (webhook) => webhook.isActive && webhook.events.includes(event)
    );

    console.log("Active webhooks for event:", activeWebhooks);

    const promises = activeWebhooks.map(async (webhook) => {
      try {
        const payload = {
          event,
          workspaceId,
          data,
          timestamp: new Date().toISOString(),
        };
        console.log(`Sending webhook to ${webhook.url}:`, payload);

        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": generateSignature(webhook.secret, data),
          },
          body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log(
          `Webhook response from ${webhook.url}:`,
          response.status,
          responseText
        );
      } catch (error) {
        console.error(`Webhook delivery failed for ${webhook.url}:`, error);
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error("Webhook trigger failed:", error);
  }
}

export const sendDiscordWebhook = async (
  webhook: { url: string },
  {
    title,
    description,
    color,
    fields,
  }: {
    title: string;
    color?: number;
    description: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }
) => {
  const discordPayload = {
    username: title,
    embeds: [
      {
        title,
        description,
        color: color ?? 3447003,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await fetch(webhook.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordPayload),
  });
};

export function generateSignature<T>(secret: string, data: T): string {
  const payload = JSON.stringify(data);
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
