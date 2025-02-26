import React from "react";
import { Card, Badge, ScrollArea, Divider, Group } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { CodeHighlight } from "@mantine/code-highlight";
import classes from "./CSS/DisplayArea.module.css";

interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}
interface ResponseMetadata {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latency: string;
}

interface Response {
  text: string;
  metadata: ResponseMetadata;
}

interface ResponseProps {
  response: Response;
}

export function DisplayArea({ response }: ResponseProps) {
  return (
    <Card
      className={classes.displayCard}
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
    >
      <ScrollArea className={classes.scrollArea} type="auto">
        <ReactMarkdown
          components={{
            code(props: CodeProps) {
              const { node, inline, className, children, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <CodeHighlight
                  code={String(children).replace(/\n$/, "")}
                  language={match?.[1] || ""}
                >
                  {String(children).replace(/\n$/, "")}
                </CodeHighlight>
              ) : (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {response.text}
        </ReactMarkdown>
      </ScrollArea>
      <Divider my="sm" />
      <Group mt="md" mb="sm">
        <Badge color="blue">{response.metadata.model}</Badge>
        <Group gap="xs">
          <Badge color="gray">Tokens: {response.metadata.totalTokens}</Badge>
          <Badge color="teal">Latency: {response.metadata.latency}</Badge>
        </Group>
      </Group>
    </Card>
  );
}
