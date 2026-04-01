import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

const buttonVariants = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center font-semibold transition-all rounded-lg shadow-sm all 150ms ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ],
  variants: {
    variant: {
      // Login button gradient style - primary CTA
      primary: [
        "bg-gradient-to-r from-primary-dark to-primary",
        "text-primary-foreground",
        "hover:from-primary-dark/90 hover:to-primary/90",
        "shadow-sm",
      ],
      // Secondary style
      secondary: [
        "bg-secondary text-secondary-foreground",
        "border border-border",
        "hover:bg-muted",
      ],
      // Ghost style
      ghost: [
        "bg-transparent text-muted-foreground",
        "hover:text-foreground hover:bg-muted",
      ],
      // Outline style
      outline: [
        "bg-transparent text-foreground",
        "border border-border",
        "hover:bg-muted",
      ],
      // Destructive style
      destructive: [
        "bg-destructive text-destructive-foreground",
        "hover:bg-destructive/90",
      ],
    },
    size: {
      sm: "h-8 px-3 gap-1.5 text-sm [&_svg]:size-4",
      md: "h-9 px-4 gap-2 text-sm [&_svg]:size-4",
      lg: "h-14 px-6 gap-2.5 text-base [&_svg]:size-5",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      data-slot="button"
      data-disabled={disabled ? "" : undefined}
      className={twMerge(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
