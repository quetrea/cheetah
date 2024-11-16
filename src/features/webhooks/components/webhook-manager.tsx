"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useCreateWebhook } from "../api/use-create-webhook";
import { useGetWebhooks } from "../api/use-get-webhooks";
import { useUpdateWebhook } from "../api/use-update-webhook";
import { useDeleteWebhook } from "../api/use-delete-webhook";
import { Webhook, WebhookEvent } from "../types";
import { createWebhookSchema } from "../schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Settings2, ArrowLeftIcon } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Önce grupları tanımlayalım
const EVENT_GROUPS = {
  Tasks: [
    WebhookEvent.TASK_CREATED,
    WebhookEvent.TASK_UPDATED,
    WebhookEvent.TASK_DELETED,
  ],
  Projects: [
    WebhookEvent.PROJECT_CREATED,
    WebhookEvent.PROJECT_UPDATED,
    WebhookEvent.PROJECT_DELETED,
  ],
  Subtasks: [
    WebhookEvent.SUBTASK_CREATED,
    WebhookEvent.SUBTASK_UPDATED,
    WebhookEvent.SUBTASK_DELETED,
  ],
} as const;

export const WebhookManager = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [isCreating, setIsCreating] = useState(false);
  const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null);

  const { data: webhooks, isLoading } = useGetWebhooks({ workspaceId });
  const { mutate: createWebhook } = useCreateWebhook();
  const { mutate: updateWebhook } = useUpdateWebhook();
  const { mutate: deleteWebhook } = useDeleteWebhook();

  const form = useForm<z.infer<typeof createWebhookSchema>>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues: {
      workspaceId,
      name: "",
      url: "",
      events: [],
      secret: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isCreating) {
      form.reset({
        workspaceId,
        name: "",
        url: "",
        events: [],
        secret: "",
        isActive: true,
      });
    }
  }, [isCreating, form, workspaceId]);

  const onSubmit = (values: z.infer<typeof createWebhookSchema>) => {
    createWebhook(
      { json: values },
      {
        onSuccess: () => {
          setIsCreating(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Webhook creation failed:", error);
        },
      }
    );
  };

  const handleEdit = (webhook: Webhook) => {
    form.reset({
      workspaceId,
      name: webhook.name,
      url: webhook.url,
      secret: webhook.secret,
      events: webhook.events,
      isActive: webhook.isActive,
    });
    setEditingWebhookId(webhook.$id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 sm:gap-x-6 sm:justify-between">
        <Button
          variant={"outline"}
          onClick={() => router.push(`/workspaces/${workspaceId}/settings`)}
          className="w-full sm:w-auto"
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold">Discord Webhooks</h2>
          <p className="text-muted-foreground text-sm">
            Manage your webhook integrations
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreating(!isCreating);
            if (!isCreating) {
              form.reset({
                workspaceId,
                name: "",
                url: "",
                events: [],
                secret: "",
                isActive: true,
              });
            }
          }}
          className="w-full sm:w-auto"
        >
          {isCreating ? "Cancel" : "Add Webhook"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>New Webhook</CardTitle>
            <CardDescription className="space-y-2">
              <p>Create a new webhook to receive events from your workspace.</p>
              <div className="mt-2 text-sm">
                <strong>For Discord Integration:</strong>
                <ul className="list-disc list-inside ml-2">
                  <li>
                    Go to Discord Server Settings → Integrations → Webhooks
                  </li>
                  <li>Click &quot;New Webhook&quot; and customize it</li>
                  <li>
                    Copy the Webhook URL and paste it in the Endpoint URL field
                  </li>
                  <li>
                    Generate a random secret key for security (e.g., use a
                    password generator)
                  </li>
                </ul>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="My Webhook" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endpoint URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://api.example.com/webhook"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter a secure secret key"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="events"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Events</FormLabel>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={
                              field.value.length ===
                              Object.values(WebhookEvent).length
                            }
                            onCheckedChange={(
                              checked: boolean | "indeterminate"
                            ) => {
                              if (checked === true) {
                                form.setValue(
                                  "events",
                                  Object.values(WebhookEvent),
                                  { shouldDirty: true }
                                );
                              } else {
                                form.setValue("events", [], {
                                  shouldDirty: true,
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor="select-all"
                            className="text-sm font-medium"
                          >
                            Select All Events
                          </label>
                        </div>

                        {Object.entries(EVENT_GROUPS).map(
                          ([groupName, groupEvents]) => (
                            <div key={groupName} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`group-${groupName}`}
                                  checked={groupEvents.every((event) =>
                                    field.value.includes(event)
                                  )}
                                  onCheckedChange={(
                                    checked: boolean | "indeterminate"
                                  ) => {
                                    const currentEvents = new Set(field.value);

                                    if (checked === true) {
                                      groupEvents.forEach((event) =>
                                        currentEvents.add(event)
                                      );
                                    } else {
                                      groupEvents.forEach((event) =>
                                        currentEvents.delete(event)
                                      );
                                    }

                                    form.setValue(
                                      "events",
                                      Array.from(currentEvents),
                                      { shouldDirty: true }
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`group-${groupName}`}
                                  className="text-sm font-medium"
                                >
                                  {groupName}
                                </label>
                              </div>

                              <div className="grid grid-cols-2 gap-4 ml-6">
                                {groupEvents.map((event) => (
                                  <div
                                    key={event}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={event}
                                      checked={field.value.includes(event)}
                                      onCheckedChange={(
                                        checked: boolean | "indeterminate"
                                      ) => {
                                        const currentEvents = new Set(
                                          field.value
                                        );

                                        if (checked === true) {
                                          currentEvents.add(event);
                                        } else {
                                          currentEvents.delete(event);
                                        }

                                        form.setValue(
                                          "events",
                                          Array.from(currentEvents),
                                          { shouldDirty: true }
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={event}
                                      className="text-sm text-muted-foreground"
                                    >
                                      {event}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create Webhook</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {webhooks?.documents.map(
          (webhook: {
            $id: string;
            name: string;
            url: string;
            events: WebhookEvent[];
            isActive: boolean;
            secret: string;
          }) => (
            <Card key={webhook.$id} className="relative">
              {editingWebhookId === webhook.$id ? (
                <CardContent className="p-6">
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} defaultValue={webhook.name} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input {...field} defaultValue={webhook.url} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                defaultValue={webhook.secret}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="events"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Events</FormLabel>
                            <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="select-all"
                                  checked={
                                    field.value.length ===
                                    Object.values(WebhookEvent).length
                                  }
                                  onCheckedChange={(
                                    checked: boolean | "indeterminate"
                                  ) => {
                                    if (checked === true) {
                                      form.setValue(
                                        "events",
                                        Object.values(WebhookEvent),
                                        { shouldDirty: true }
                                      );
                                    } else {
                                      form.setValue("events", [], {
                                        shouldDirty: true,
                                      });
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="select-all"
                                  className="text-sm font-medium"
                                >
                                  Select All Events
                                </label>
                              </div>

                              {Object.entries(EVENT_GROUPS).map(
                                ([groupName, groupEvents]) => (
                                  <div key={groupName} className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`group-${groupName}`}
                                        checked={groupEvents.every((event) =>
                                          field.value.includes(event)
                                        )}
                                        onCheckedChange={(
                                          checked: boolean | "indeterminate"
                                        ) => {
                                          const currentEvents = new Set(
                                            field.value
                                          );

                                          if (checked === true) {
                                            groupEvents.forEach((event) =>
                                              currentEvents.add(event)
                                            );
                                          } else {
                                            groupEvents.forEach((event) =>
                                              currentEvents.delete(event)
                                            );
                                          }

                                          form.setValue(
                                            "events",
                                            Array.from(currentEvents),
                                            { shouldDirty: true }
                                          );
                                        }}
                                      />
                                      <label
                                        htmlFor={`group-${groupName}`}
                                        className="text-sm font-medium"
                                      >
                                        {groupName}
                                      </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 ml-6">
                                      {groupEvents.map((event) => (
                                        <div
                                          key={event}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={event}
                                            checked={field.value.includes(
                                              event
                                            )}
                                            onCheckedChange={(
                                              checked: boolean | "indeterminate"
                                            ) => {
                                              const currentEvents = new Set(
                                                field.value
                                              );

                                              if (checked === true) {
                                                currentEvents.add(event);
                                              } else {
                                                currentEvents.delete(event);
                                              }

                                              form.setValue(
                                                "events",
                                                Array.from(currentEvents),
                                                { shouldDirty: true }
                                              );
                                            }}
                                          />
                                          <label
                                            htmlFor={event}
                                            className="text-sm text-muted-foreground"
                                          >
                                            {event}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            updateWebhook({
                              param: { webhookId: webhook.$id },
                              json: {
                                ...form.getValues(),
                                workspaceId,
                              },
                            });
                            setEditingWebhookId(null);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingWebhookId(null);
                            form.reset();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 w-full sm:w-auto">
                        <CardTitle className="break-all">
                          {webhook.name}
                        </CardTitle>
                        <CardDescription className="truncate max-w-[200px] sm:max-w-[300px]">
                          {webhook.url}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                        <Switch
                          checked={webhook.isActive}
                          onCheckedChange={(checked: boolean) =>
                            updateWebhook({
                              param: { webhookId: webhook.$id },
                              json: {
                                workspaceId,
                                isActive: checked,
                              },
                            })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(webhook as Webhook)}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            deleteWebhook({
                              param: { webhookId: webhook.$id },
                              json: { workspaceId },
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge
                          key={event}
                          variant="secondary"
                          className="text-xs break-all"
                        >
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )
        )}
      </div>
    </Card>
  );
};
