import { NextResponse } from 'next/server';

const demoScenarios = [
  {
    id: 'routine-followup',
    name: 'Routine Follow-up',
    transcript: `Nurse: Hi Mrs. Johnson, this is nurse Karen from Dr. Smith's office calling to follow up on your recent visit.

Patient: Oh hi Karen, yes I remember.

Nurse: How have you been feeling since your appointment last week?

Patient: Much better actually. The new blood pressure medication seems to be working well. I've been taking it every morning with breakfast like you instructed.

Nurse: That's wonderful to hear. Have you experienced any side effects? Dizziness, headaches, anything like that?

Patient: No, nothing at all. I feel great.

Nurse: Excellent. Are you still taking your other medications - the metformin for your diabetes?

Patient: Yes, twice a day, morning and evening.

Nurse: Perfect. Let me schedule your follow-up appointment for three months from now to check your blood pressure and do routine blood work.

Patient: That sounds good. Thank you so much.

Nurse: You're welcome! Have a great day.`,
    expectedInsights: {
      urgency: 'low',
      summary: 'Routine follow-up call with positive patient response to new blood pressure medication. No adverse effects reported. Patient compliant with medication regimen.',
      flags: [],
      medications: [
        { name: 'Blood pressure medication', dosage: 'Once daily with breakfast' },
        { name: 'Metformin', dosage: 'Twice daily (morning and evening)' }
      ],
      appointments: [
        { type: 'Follow-up appointment', note: 'Scheduled in 3 months for blood pressure check and routine blood work' }
      ]
    }
  },
  {
    id: 'urgent-symptoms',
    name: 'Urgent Symptoms',
    transcript: `Nurse: This is nurse Emily from Cardiology Associates. How can I help you today?

Patient: Hi, I'm calling because I've been having some chest pain for the past hour. It's a tightness in the center of my chest.

Nurse: I understand. Can you describe the pain? Is it constant or does it come and go?

Patient: It's pretty constant. It started while I was resting, not even doing anything strenuous.

Nurse: Are you experiencing any other symptoms? Shortness of breath, nausea, pain radiating to your arm or jaw?

Patient: Yes, actually my left arm feels a bit tingly and I'm sweating quite a bit.

Nurse: Okay, and what medications are you currently taking?

Patient: I take aspirin 81mg daily, and I'm on Lipitor 40mg for cholesterol. Oh, and I take lisinopril 10mg for blood pressure.

Nurse: Have you taken your aspirin today?

Patient: Yes, I took it this morning.

Nurse: Sir, based on your symptoms, I need you to call 911 immediately or have someone take you to the emergency room right away. This could be serious. Do not drive yourself. Can you do that?

Patient: Yes, I'll call them right now.

Nurse: Good. I'm going to alert the emergency department that you're coming in. What's your name?

Patient: Michael Thompson.

Nurse: Okay Michael, hang up and call 911 now. We'll follow up with you.`,
    expectedInsights: {
      urgency: 'critical',
      summary: 'Patient reporting acute chest pain with concerning cardiac symptoms including left arm tingling and diaphoresis. Immediate emergency evaluation required.',
      flags: [
        { type: 'Emergency Situation', description: 'Acute chest pain with radiation and associated symptoms - possible myocardial infarction', severity: 'critical' },
        { type: 'Safety Concern', description: 'Patient needs immediate emergency department evaluation', severity: 'critical' }
      ],
      medications: [
        { name: 'Aspirin', dosage: '81mg daily' },
        { name: 'Lipitor (Atorvastatin)', dosage: '40mg for cholesterol' },
        { name: 'Lisinopril', dosage: '10mg for blood pressure' }
      ],
      appointments: [
        { type: 'Emergency Department', note: 'Immediate evaluation needed - 911 dispatch recommended' }
      ]
    }
  },
  {
    id: 'medication-interaction',
    name: 'Medication Concern',
    transcript: `Pharmacist: Hi, this is David from Riverside Pharmacy. I'm calling about your recent prescriptions.

Patient: Oh yes, what's going on?

Pharmacist: I noticed Dr. Lee prescribed you a new antibiotic - ciprofloxacin - for your urinary tract infection. Can you tell me what other medications you're currently taking?

Patient: Sure, let me grab my list. I take warfarin 5mg daily for my heart, metformin for diabetes, and I just started taking ibuprofen for my back pain a few days ago.

Pharmacist: I see. Are you taking any supplements or over-the-counter medications?

Patient: Just a daily multivitamin and I've been taking some calcium supplements my doctor recommended.

Pharmacist: Okay, thank you for that information. I have a concern about the combination of ciprofloxacin and warfarin. These two medications can interact and increase your risk of bleeding. Also, taking calcium supplements can reduce the effectiveness of ciprofloxacin.

Patient: Oh no, is that dangerous?

Pharmacist: It can be, which is why I wanted to call before filling this prescription. We'll need to contact Dr. Lee to discuss either an alternative antibiotic or closer monitoring of your INR levels if we proceed with the cipro. Also, the ibuprofen combined with warfarin increases bleeding risk as well.

Patient: I had no idea. What should I do about the ibuprofen?

Pharmacist: I'd recommend stopping the ibuprofen and talking to Dr. Lee about a safer pain management option for your back. Acetaminophen would be better with your warfarin.

Patient: Okay, I'll stop taking it today. So should I not take the antibiotic yet?

Pharmacist: Correct, hold off until I speak with Dr. Lee. I'll call you back within a couple hours with a plan. Do you have any other questions?

Patient: No, thank you so much for catching that.

Pharmacist: You're welcome. That's what we're here for. Talk to you soon.`,
    expectedInsights: {
      urgency: 'high',
      summary: 'Pharmacist identified multiple concerning drug interactions involving warfarin, ciprofloxacin, ibuprofen, and calcium supplements. Prescription hold pending provider consultation.',
      flags: [
        { type: 'Drug Interaction', description: 'Ciprofloxacin + Warfarin interaction - increased bleeding risk', severity: 'high' },
        { type: 'Drug Interaction', description: 'Ibuprofen + Warfarin - increased bleeding risk', severity: 'high' },
        { type: 'Medication Effectiveness', description: 'Calcium supplements may reduce ciprofloxacin absorption', severity: 'medium' }
      ],
      medications: [
        { name: 'Warfarin', dosage: '5mg daily' },
        { name: 'Metformin', dosage: 'For diabetes' },
        { name: 'Ibuprofen', dosage: 'Recently started for back pain' },
        { name: 'Ciprofloxacin', dosage: 'NEW - on hold due to interactions' },
        { name: 'Multivitamin', dosage: 'Daily' },
        { name: 'Calcium supplement', dosage: 'As recommended' }
      ],
      appointments: [
        { type: 'Provider consultation', note: 'Pharmacist to consult with Dr. Lee regarding antibiotic alternative or INR monitoring plan' }
      ]
    }
  }
];

export async function GET() {
  return NextResponse.json({ scenarios: demoScenarios });
}

export async function POST(request: Request) {
  try {
    const { scenarioId } = await request.json();

    const scenario = demoScenarios.find(s => s.id === scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      transcript: scenario.transcript,
      insights: scenario.expectedInsights
    });
  } catch (error: any) {
    console.error('Demo error:', error);
    return NextResponse.json(
      { error: 'Demo failed', details: error.message },
      { status: 500 }
    );
  }
}
