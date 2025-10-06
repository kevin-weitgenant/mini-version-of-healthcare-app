import type { Medicine } from '../db/schema';

interface TreatmentPlanTemplate {
  diagnosisName: string;
  diagnosisDescription: string;
  medicines: Medicine[];
  lifestyleAdvice: string[];
  doctorNotes: string;
}

// Treatment plan templates based on common conditions
const TREATMENT_TEMPLATES: Record<string, TreatmentPlanTemplate> = {
  hypertension: {
    diagnosisName: "Hypertension (High Blood Pressure)",
    diagnosisDescription: "Your blood pressure readings have been consistently elevated. We're implementing a treatment plan to help manage and reduce your blood pressure to healthy levels.",
    medicines: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily in the morning",
        duration: "Ongoing"
      },
      {
        name: "Aspirin",
        dosage: "100mg",
        frequency: "Once daily",
        duration: "Ongoing"
      },
      {
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "Ongoing"
      }
    ],
    lifestyleAdvice: [
      "Maintain a balanced diet rich in fruits and vegetables",
      "Limit sodium intake to less than 2,300mg per day",
      "Exercise for at least 30 minutes, 5 days a week",
      "Monitor blood pressure daily and keep a log",
      "Avoid smoking and limit alcohol consumption",
      "Get 7-8 hours of quality sleep each night"
    ],
    doctorNotes: "Patient is responding well to initial treatment. Continue monitoring blood pressure daily and maintain medication schedule. Follow-up appointment scheduled in 4 weeks to assess progress and adjust treatment if necessary. Please contact immediately if you experience any severe side effects or symptoms."
  },

  diabetes: {
    diagnosisName: "Type 2 Diabetes Mellitus",
    diagnosisDescription: "Your blood glucose levels indicate Type 2 Diabetes. We're starting a comprehensive treatment plan to manage your blood sugar levels and prevent complications.",
    medicines: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily with meals",
        duration: "Ongoing"
      },
      {
        name: "Glimepiride",
        dosage: "2mg",
        frequency: "Once daily before breakfast",
        duration: "Ongoing"
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        duration: "Ongoing"
      }
    ],
    lifestyleAdvice: [
      "Follow a diabetic-friendly diet with controlled carbohydrate intake",
      "Monitor blood glucose levels twice daily (fasting and post-meal)",
      "Engage in regular physical activity for at least 150 minutes per week",
      "Maintain a healthy body weight (aim for BMI 18.5-24.9)",
      "Stay hydrated and drink at least 8 glasses of water daily",
      "Schedule regular eye and foot examinations"
    ],
    doctorNotes: "Patient has been educated about diabetes management and dietary modifications. Starting with oral medications and will reassess in 8 weeks. Patient should maintain a glucose log and bring it to follow-up appointments. Contact clinic if blood sugar drops below 70 or rises above 250."
  },

  respiratory: {
    diagnosisName: "Upper Respiratory Tract Infection",
    diagnosisDescription: "You have symptoms consistent with an upper respiratory tract infection. Treatment focuses on symptom relief and preventing complications.",
    medicines: [
      {
        name: "Azithromycin",
        dosage: "500mg",
        frequency: "Once daily",
        duration: "5 days"
      },
      {
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "7 days"
      },
      {
        name: "Dextromethorphan",
        dosage: "15mg",
        frequency: "Three times daily as needed",
        duration: "7 days"
      }
    ],
    lifestyleAdvice: [
      "Get plenty of rest and sleep (at least 8-9 hours per night)",
      "Stay well hydrated with warm fluids, soups, and water",
      "Use a humidifier to keep air moist and ease breathing",
      "Avoid exposure to smoke, dust, and other irritants",
      "Wash hands frequently to prevent spread of infection",
      "Cover mouth when coughing or sneezing"
    ],
    doctorNotes: "Patient shows signs of upper respiratory infection with no complications. Prescribed antibiotics as precautionary measure. Should see improvement within 3-5 days. Return if symptoms worsen, fever persists beyond 3 days, or breathing difficulties develop."
  },

  cardiac: {
    diagnosisName: "Angina Pectoris (Chest Pain)",
    diagnosisDescription: "Your symptoms suggest angina, which is chest pain caused by reduced blood flow to the heart. We're implementing treatment to improve blood flow and reduce symptoms.",
    medicines: [
      {
        name: "Aspirin",
        dosage: "325mg",
        frequency: "Once daily",
        duration: "Ongoing"
      },
      {
        name: "Atorvastatin",
        dosage: "40mg",
        frequency: "Once daily at bedtime",
        duration: "Ongoing"
      },
      {
        name: "Metoprolol",
        dosage: "50mg",
        frequency: "Twice daily",
        duration: "Ongoing"
      },
      {
        name: "Nitroglycerin",
        dosage: "0.4mg",
        frequency: "As needed for chest pain",
        duration: "Keep on hand"
      }
    ],
    lifestyleAdvice: [
      "Follow a heart-healthy diet low in saturated fats and cholesterol",
      "Engage in light to moderate exercise as tolerated",
      "Avoid strenuous activities that trigger chest pain",
      "Monitor and manage stress through relaxation techniques",
      "Quit smoking immediately if applicable",
      "Keep nitroglycerin readily accessible at all times"
    ],
    doctorNotes: "Patient experiencing angina symptoms. Prescribed medications to improve cardiac function and reduce symptoms. ECG and stress test scheduled for next week. Patient instructed on when to use nitroglycerin and when to seek emergency care. If chest pain lasts more than 5 minutes despite rest and medication, call emergency services immediately."
  },

  musculoskeletal: {
    diagnosisName: "Musculoskeletal Pain Syndrome",
    diagnosisDescription: "You're experiencing musculoskeletal pain likely due to strain, overuse, or minor injury. Treatment focuses on pain management and promoting healing.",
    medicines: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily with food",
        duration: "7-10 days"
      },
      {
        name: "Cyclobenzaprine",
        dosage: "10mg",
        frequency: "Once daily at bedtime",
        duration: "5-7 days"
      },
      {
        name: "Topical Diclofenac Gel",
        dosage: "Apply to affected area",
        frequency: "Three times daily",
        duration: "10 days"
      }
    ],
    lifestyleAdvice: [
      "Apply ice to the affected area for 15-20 minutes every 2-3 hours for first 48 hours",
      "Rest the affected area and avoid activities that worsen pain",
      "Gentle stretching exercises after initial inflammation subsides",
      "Maintain good posture and ergonomic workspace setup",
      "Gradually return to normal activities as pain improves",
      "Consider physical therapy if pain persists beyond 2 weeks"
    ],
    doctorNotes: "Patient presenting with musculoskeletal pain. No signs of fracture or serious injury on examination. Prescribed NSAIDs and muscle relaxant for symptom management. Should see improvement within 7-10 days. Return if pain worsens, numbness develops, or no improvement after 2 weeks."
  },

  wellness: {
    diagnosisName: "General Health Checkup - Normal Findings",
    diagnosisDescription: "Your routine health checkup shows overall good health. Continue maintaining healthy lifestyle habits to prevent future health issues.",
    medicines: [
      {
        name: "Multivitamin",
        dosage: "One tablet",
        frequency: "Once daily with breakfast",
        duration: "Ongoing"
      },
      {
        name: "Vitamin D3",
        dosage: "1000 IU",
        frequency: "Once daily",
        duration: "Ongoing"
      },
      {
        name: "Omega-3 Fish Oil",
        dosage: "1000mg",
        frequency: "Once daily with meal",
        duration: "Ongoing"
      }
    ],
    lifestyleAdvice: [
      "Maintain a balanced diet with plenty of fruits, vegetables, and whole grains",
      "Engage in regular physical activity for at least 30 minutes, 5 days per week",
      "Stay hydrated with at least 8 glasses of water daily",
      "Get 7-8 hours of quality sleep each night",
      "Manage stress through relaxation techniques or hobbies",
      "Schedule regular health checkups and screenings as recommended"
    ],
    doctorNotes: "Patient in good health with no significant concerns. All vital signs and laboratory results within normal ranges. Encouraged to continue healthy lifestyle habits. Recommended annual checkup and age-appropriate health screenings. Patient educated on warning signs to watch for and when to seek medical attention."
  }
};

/**
 * Generates a treatment plan based on visit reason keywords
 * @param visitReason - The reason for the appointment visit
 * @param doctorSpecialty - Optional doctor specialty to help determine treatment type
 * @returns Treatment plan object with diagnosis, medicines, lifestyle advice, and doctor notes
 */
export function generateTreatmentPlan(visitReason: string, doctorSpecialty?: string): TreatmentPlanTemplate {
  const lowerReason = visitReason.toLowerCase();
  const lowerSpecialty = doctorSpecialty?.toLowerCase() || '';

  // Check for hypertension/blood pressure keywords
  if (
    lowerReason.includes('blood pressure') ||
    lowerReason.includes('hypertension') ||
    lowerReason.includes('high bp') ||
    lowerSpecialty.includes('cardiology')
  ) {
    return TREATMENT_TEMPLATES.hypertension;
  }

  // Check for diabetes keywords
  if (
    lowerReason.includes('diabetes') ||
    lowerReason.includes('blood sugar') ||
    lowerReason.includes('glucose') ||
    lowerReason.includes('diabetic') ||
    lowerSpecialty.includes('endocrinology')
  ) {
    return TREATMENT_TEMPLATES.diabetes;
  }

  // Check for respiratory keywords
  if (
    lowerReason.includes('cough') ||
    lowerReason.includes('cold') ||
    lowerReason.includes('fever') ||
    lowerReason.includes('flu') ||
    lowerReason.includes('respiratory') ||
    lowerReason.includes('breathing') ||
    lowerReason.includes('congestion') ||
    lowerSpecialty.includes('pulmonology')
  ) {
    return TREATMENT_TEMPLATES.respiratory;
  }

  // Check for cardiac keywords
  if (
    lowerReason.includes('chest pain') ||
    lowerReason.includes('heart') ||
    lowerReason.includes('angina') ||
    lowerReason.includes('cardiac')
  ) {
    return TREATMENT_TEMPLATES.cardiac;
  }

  // Check for musculoskeletal/pain keywords
  if (
    lowerReason.includes('pain') ||
    lowerReason.includes('back') ||
    lowerReason.includes('neck') ||
    lowerReason.includes('joint') ||
    lowerReason.includes('muscle') ||
    lowerReason.includes('arthritis') ||
    lowerReason.includes('injury') ||
    lowerSpecialty.includes('orthopedic')
  ) {
    return TREATMENT_TEMPLATES.musculoskeletal;
  }

  // Check for general checkup keywords
  if (
    lowerReason.includes('checkup') ||
    lowerReason.includes('check up') ||
    lowerReason.includes('check-up') ||
    lowerReason.includes('routine') ||
    lowerReason.includes('physical') ||
    lowerReason.includes('wellness') ||
    lowerReason.includes('general')
  ) {
    return TREATMENT_TEMPLATES.wellness;
  }

  // Default to wellness template if no keywords match
  return TREATMENT_TEMPLATES.wellness;
}

