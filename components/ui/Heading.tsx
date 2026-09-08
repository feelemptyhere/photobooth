import { ReactNode } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}

const sizes: Record<1 | 2 | 3, string> = {
  1: "text-2xl md:text-3xl",
  2: "text-xl md:text-2xl",
  3: "text-base md:text-lg",
};

/**
 * Editorial heading — uppercase, wide letter-spacing, thin weight (PRD §4).
 */
export function Heading({ level = 1, children, className = "" }: HeadingProps) {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`editorial font-light text-ink ${sizes[level]} ${className}`}
    >
      {children}
    </Tag>
  );
}
