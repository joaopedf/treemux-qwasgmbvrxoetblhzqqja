'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Phone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const mockCalls = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    patientName: 'Sarah Johnson',
    duration: '8:45',
    status: 'completed' as const,
    summary: 'Routine follow-up, medication refill approved',
    flags: []
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    patientName: 'Michael Chen',
    duration: '12:30',
    status: 'flagged' as const,
    summary: 'New symptoms reported - chest pain',
    flags: ['High urgency', 'Possible drug interaction']
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    patientName: 'Emily Rodriguez',
    duration: '6:15',
    status: 'completed' as const,
    summary: 'Appointment scheduled for next week',
    flags: []
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    patientName: 'David Kim',
    duration: '15:20',
    status: 'flagged' as const,
    summary: 'Multiple medication concerns discussed',
    flags: ['Medication review needed']
  }
];

export function CallHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCalls.map((call) => (
            <div
              key={call.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-full ${call.status === 'flagged' ? 'bg-red-100' : 'bg-green-100'}`}>
                {call.status === 'flagged' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{call.patientName}</h4>
                  <Badge variant={call.status === 'flagged' ? 'destructive' : 'secondary'}>
                    {call.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{call.summary}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(call.timestamp, 'h:mm a')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {call.duration}
                  </span>
                </div>
                {call.flags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {call.flags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
