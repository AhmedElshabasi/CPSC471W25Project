import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const NoResultsPage = () => {
  return (
    <div className="mt-[20pt] mx-[60pt]">
      <div className="flex justify-center">
        <Card className="w-full max-w-[800pt] min-h-[120pt] flex items-center justify-center shadow-md">
          <CardContent className="text-center pt-6 px-6">
            <p className="text-lg text-muted-foreground font-medium">
              We couldn't find any movies that match your search.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoResultsPage;
