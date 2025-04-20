import React from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const fetcher = url => fetch(url).then(res => res.json());

export default function RecommendedContests() {
  const { data, error } = useSWR('/api/recommendations', fetcher);

  if (error) return <div>Error loading contest recommendations.</div>;
  if (!data) return <div>Loading contest recommendations…</div>;

  return (
    <Card>
      <CardHeader>Recommended Contests</CardHeader>
      <CardContent className="space-y-2">
        {data.contests.map((c) => (
          <div
            key={c.itemId._id}
            className="flex items-center justify-between"
          >
            <Link
              to={`/contests/${c.itemId._id}`}
              className="hover:underline"
            >
              {c.itemId.name} — {new Date(c.itemId.startTime).toLocaleString()}
            </Link>
            <Button size="sm" asChild>
              <Link to={`/contests/${c.itemId._id}/register`}>Register</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}