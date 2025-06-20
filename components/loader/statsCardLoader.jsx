import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardLoader = () => {
  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};
