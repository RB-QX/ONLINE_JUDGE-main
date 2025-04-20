import React from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const fetcher = url => fetch(url).then(res => res.json());

export default function RecommendedPeers() {
  const { data, error } = useSWR('/api/recommendations', fetcher);

  if (error) return <div>Error loading peer recommendations.</div>;
  if (!data) return <div>Loading peer recommendations…</div>;

  return (
    <Card>
      <CardHeader>Recommended Peers</CardHeader>
      <CardContent className="space-y-2">
        {data.peers.map((u) => (
          <Link
            to={`/users/${u.itemId._id}`}
            key={u.itemId._id}
            className="flex justify-between hover:underline"
          >
            <span>{u.itemId.username}</span>
            <Badge>{u.itemId.rating}</Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}