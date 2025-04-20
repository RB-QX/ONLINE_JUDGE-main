// src/components/recommendations/Problems.jsx
import React from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const fetcher = url => fetch(url).then(res => res.json());

export default function RecommendedProblems() {
  const { data, error } = useSWR('/api/recommendations', fetcher);

  if (error) return <div>Error loading recommendations</div>;
  if (!data) return <div>Loading…</div>;

  return (
    <Card>
      <CardHeader>Recommended Problems</CardHeader>
      <CardContent className="space-y-2">
        {data.problems.map(p => (
          <Link
            to={`/problems/${p.itemId._id}`}
            key={p.itemId._id}
            className="flex justify-between"
          >
            <span>{p.itemId.title}</span>
            <Badge>{p.itemId.difficulty}</Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
