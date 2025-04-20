import React from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const fetcher = url => fetch(url).then(res => res.json());

export default function RecommendedTopics() {
  const { data, error } = useSWR('/api/recommendations', fetcher);

  if (error) return <div>Error loading topic recommendations.</div>;
  if (!data) return <div>Loading topic recommendations…</div>;

  return (
    <Card>
      <CardHeader>Recommended Topics</CardHeader>
      <CardContent className="space-y-2">
        {data.tags.map((t) => (
          <Link
            to={`/problems?tag=${encodeURIComponent(t.tag)}`}
            key={t.tag}
            className="flex justify-between hover:underline"
          >
            <span>{t.tag}</span>
            <Badge>{Math.round(t.score)}</Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}