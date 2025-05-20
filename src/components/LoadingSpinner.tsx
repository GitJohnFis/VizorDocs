import type { LucideProps } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, ...props }: LucideProps) {
  return <Loader2 className={cn('animate-spin', className)} {...props} />;
}
