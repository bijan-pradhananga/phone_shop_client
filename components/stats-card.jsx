"use client";

import { Card, CardContent } from "@/components/ui/card";

export const StatCard = ({ icon: Icon, title, value }) => {
    return (
        <Card className="w-full shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <Icon className="h-8 w-8 text-primary" /> 
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
};