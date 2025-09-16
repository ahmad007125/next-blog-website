"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type BlogCardProps = {
  title: string;
  category: string;
  description: string;
  href: string;
};

export function BlogCard({ title, category, description, href }: BlogCardProps) {
  return (
    <Card className="h-full transition-colors hover:border-foreground/20">
      <CardHeader>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{category}</div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {/* You can place an image or meta here later */}
      </CardContent>
      <CardFooter>
        <Link href={href} className="ml-auto">
          <Button variant="default">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}


