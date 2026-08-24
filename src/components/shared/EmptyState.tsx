import { SearchX, PillBottle, Bell, MessageCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        gap: 12,
      }}
    >
      {icon && (
        <div
          style={{
            width: 72,
            height: 72,
            background: "var(--color-primary-50)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
            color: "var(--color-primary)",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontWeight: 700,
          fontSize: 17,
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        {description}
      </p>
      {action && (
        <button
          className="btn-primary"
          style={{ marginTop: 8 }}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoMedicinesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<PillBottle size={32} />}
      title="No Medicines Yet"
      description="Scan a medicine or add one manually to start tracking your medications."
      action={onAction ? { label: "Scan Medicine", onClick: onAction } : undefined}
    />
  );
}

export function NoRemindersEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Bell size={32} />}
      title="No Reminders Today"
      description="Set up medication reminders to stay on track with your treatment schedule."
      action={onAction ? { label: "Add Reminder", onClick: onAction } : undefined}
    />
  );
}

export function NoResultsEmpty({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<SearchX size={32} />}
      title="No Results Found"
      description={
        query
          ? `No results for "${query}". Try a different search term.`
          : "No results found. Try adjusting your search."
      }
    />
  );
}

export function NoChatHistory() {
  return (
    <EmptyState
      icon={<MessageCircle size={32} />}
      title="Start a Conversation"
      description="Ask me anything about medicines, prescriptions, or pharmacology."
    />
  );
}
