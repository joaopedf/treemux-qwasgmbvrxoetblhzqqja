export interface DemoCase {
  id: string;
  name: string;
  description: string;
  input: string;
  expectedUrgency: 'immediate' | 'urgent' | 'non-urgent';
}

export const demoCases: DemoCase[] = [
  {
    id: 'cardiac',
    name: 'Cardiac Emergency',
    description: 'Chest pain case - Should be IMMEDIATE',
    input: `65-year-old male presenting with severe crushing chest pain radiating to left arm. Pain started 30 minutes ago. Patient is sweating profusely and appears pale. Reports feeling nauseous and short of breath. Has history of hypertension and high cholesterol. Pain rated 9/10.`,
    expectedUrgency: 'immediate',
  },
  {
    id: 'respiratory',
    name: 'Respiratory Distress',
    description: 'Severe breathing difficulty - Should be IMMEDIATE',
    input: `7-year-old child with severe difficulty breathing. Respiratory rate 40/min. Audible wheezing. Nasal flaring present. Child is using accessory muscles to breathe. Cannot speak full sentences. Known asthmatic. Used inhaler 3 times with no improvement. Lips appear slightly blue.`,
    expectedUrgency: 'immediate',
  },
  {
    id: 'abdominal',
    name: 'Abdominal Pain',
    description: 'Acute abdomen - Should be URGENT',
    input: `32-year-old female with severe right lower quadrant abdominal pain for 6 hours. Pain started around umbilicus, now localized to right side. Pain worse with movement. Nausea and one episode of vomiting. Temperature 38.5°C. Appetite lost. No bowel movement today. Pain rated 7/10.`,
    expectedUrgency: 'urgent',
  },
  {
    id: 'infection',
    name: 'Possible Infection',
    description: 'Fever with symptoms - Should be URGENT',
    input: `18-month-old toddler with fever of 39.2°C for 2 days. Refusing to eat or drink. Crying inconsolably. Parents report child is more lethargic than usual. No obvious source of infection visible. One episode of vomiting this morning. Slightly decreased urine output noted by parents.`,
    expectedUrgency: 'urgent',
  },
  {
    id: 'laceration',
    name: 'Minor Laceration',
    description: 'Small cut requiring sutures - Should be URGENT',
    input: `25-year-old male with 3cm laceration on forearm from broken glass. Wound is clean, bleeding controlled with pressure. No nerve or tendon damage visible. Full range of motion and sensation intact. Patient's last tetanus shot was 3 years ago. No other injuries.`,
    expectedUrgency: 'urgent',
  },
  {
    id: 'chronic-followup',
    name: 'Chronic Condition',
    description: 'Diabetes management - Should be NON-URGENT',
    input: `55-year-old female with type 2 diabetes here for routine follow-up. Blood sugars have been running slightly elevated (150-180 mg/dL) over past 2 weeks. No acute symptoms. No hypoglycemic episodes. Wants to discuss medication adjustment. Otherwise feeling well.`,
    expectedUrgency: 'non-urgent',
  },
  {
    id: 'common-cold',
    name: 'Upper Respiratory',
    description: 'Common cold symptoms - Should be NON-URGENT',
    input: `28-year-old male with runny nose, mild sore throat, and occasional cough for 3 days. No fever. Able to eat and drink normally. Working from home but feeling okay. Just wants to make sure it's nothing serious and get advice on symptom management.`,
    expectedUrgency: 'non-urgent',
  },
  {
    id: 'sprain',
    name: 'Ankle Sprain',
    description: 'Minor injury - Should be NON-URGENT',
    input: `22-year-old athlete twisted ankle during practice yesterday. Moderate swelling and bruising present. Can bear some weight but limping. Ankle tender to touch. No deformity noted. Already using RICE protocol at home. Seeking evaluation and clearance to return to sports.`,
    expectedUrgency: 'non-urgent',
  },
  {
    id: 'stroke',
    name: 'Stroke Symptoms',
    description: 'Possible stroke - Should be IMMEDIATE',
    input: `72-year-old female with sudden onset of right-sided facial drooping and right arm weakness. Started 20 minutes ago. Slurred speech noted. Alert but confused. Blood pressure 180/100. History of atrial fibrillation. Not on anticoagulation currently.`,
    expectedUrgency: 'immediate',
  },
  {
    id: 'trauma',
    name: 'Head Trauma',
    description: 'Significant head injury - Should be IMMEDIATE',
    input: `45-year-old male fell from ladder approximately 10 feet. Brief loss of consciousness witnessed. Currently alert but has persistent headache and nausea. Small laceration on scalp. Neck pain present. Patient confused about events. Vomited once since arrival.`,
    expectedUrgency: 'immediate',
  },
];
