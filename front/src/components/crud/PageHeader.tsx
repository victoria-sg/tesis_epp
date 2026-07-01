import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const PageHeader = ({ title, subtitle, action }: Props) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#000",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div className="mt-1" style={{ fontSize: 13, color: "#6b6b6b" }}>
          {subtitle}
        </div>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);
