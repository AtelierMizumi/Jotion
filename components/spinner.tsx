import { Loader } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variants configuration for a spinner component using class-variance-authority (cva).
 * Cấu hình các biến thể cho component spinner sử dụng class-variance-authority (cva).
 * 
 * @constant
 * @type {cva}
 * 
 * @property {object} variants - Available variant options for the spinner
 *                            - Các tùy chọn biến thể có sẵn cho spinner
 * @property {object} variants.size - Size variations for the spinner
 *                                 - Các biến thể kích thước cho spinner
 * @property {'default'|'sm'|'lg'|'icon'} variants.size - Size options:
 *   - default: 16x16 pixels (h-4 w-4)
 *   - sm: 8x8 pixels (h-2 w-2)
 *   - lg: 24x24 pixels (h-6 w-6)
 *   - icon: 40x40 pixels (h-10 w-10)
 * 
 * @property {object} defaultVariants - Default variant settings
 *                                   - Cài đặt biến thể mặc định
 * @property {'default'} defaultVariants.size - Default size is 'default' (16x16)
 *                                           - Kích thước mặc định là 'default' (16x16)
 */
const spinnerVariants = cva(
  "text-muted-foreground animate-spin",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-2 w-2",
        lg: "h-6 w-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({
  size,
}: SpinnerProps) => {
  return (
    <Loader className={cn(spinnerVariants({ size }))} />
  );
};
