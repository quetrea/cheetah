import { Metadata } from "next/types";
import { WebhooksClient } from "./client";

export const metadata: Metadata = {
  title: "Discord Webhooks",
  description: "Webhook settings",
};

const WebhooksPage = () => {
  return <WebhooksClient />;
};

export default WebhooksPage;
