'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Square, Activity, AlertTriangle, Clock } from 'lucide-react';
import { TriageForm } from '@/components/triage-form';
import { PatientSummary } from '@/components/patient-summary';
import { useTriageStore } from '@/lib/store';

export default function Home() {
  const { sessions } = useTriageStore();
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                TriageAI
              </h1>
              <p className="text-sm text-muted-foreground">AI-Powered Medical Triage Assistant</p>
            </div>
          </div>

          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>For Healthcare Workers:</strong> This tool assists with preliminary patient assessments.
              Always follow clinical protocols and verify critical information.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              New Patient
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History ({sessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div>
                <Card className="shadow-lg border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-blue-600" />
                      Patient Interview
                    </CardTitle>
                    <CardDescription>
                      Record symptoms and chief complaint, or type them in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TriageForm />
                  </CardContent>
                </Card>
              </div>

              {/* Live Results Section */}
              <div>
                <Card className="shadow-lg border-2 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Clinical Assessment
                    </CardTitle>
                    <CardDescription>
                      AI-generated triage summary and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PatientSummary />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{sessions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Patients</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {sessions.filter(s => s.urgency === 'immediate' || s.urgency === 'urgent').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Urgent Cases</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {sessions.filter(s => s.urgency === 'non-urgent').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Non-Urgent</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No patient sessions yet. Start a new triage assessment to begin.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sessions.slice().reverse().map((session) => (
                  <Card key={session.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">Patient #{session.id.slice(0, 8)}</span>
                            <Badge
                              variant={
                                session.urgency === 'immediate' ? 'destructive' :
                                session.urgency === 'urgent' ? 'default' :
                                'secondary'
                              }
                            >
                              {session.urgency}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(session.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2"><strong>Chief Complaint:</strong> {session.chiefComplaint}</p>
                          <p className="text-sm text-muted-foreground">{session.summary}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
