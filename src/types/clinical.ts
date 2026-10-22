export type ClinicalSetting = 'GP_CLINIC' | 'EMERGENCY_DEPT';

export interface DiseaseProtocol {
  id: string;
  name: string;
  organ: 'URTI / Throat' | 'Ear / ENT' | 'Lower Respiratory' | 'Urinary Tract (UTI)' | 'Skin / Soft Tissue' | 'Infected Wounds' | 'Gastrointestinal' | 'Dental / Head & Neck';
  commonPathogens: string;
  firstLine: {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions: string;
  };
  secondLineOrAllergy: {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
    note: string;
  };
  pediatricDose: string;
  renalAdjustment?: string;
  stewardshipPearl: string;
  cpgSource: string;
  redFlags: string[];
}

export interface BiomarkerRef {
  name: string;
  normalRange: string;
  redFlagThreshold: string;
  clinicalAction: string;
  cpgNotes: string;
  dangerLevel: 'LOW' | 'INTERMEDIATE' | 'CRITICAL';
}

export interface FlowchartStep {
  id: string;
  question: string;
  hint?: string;
  options: {
    label: string;
    nextStepId?: string;
    actionOutcome?: {
      title: string;
      status: 'VIRAL_WITHHOLD' | 'DELAYED_SCRIPT' | 'BACTERIAL_INDICATED' | 'URGENT_REFERRAL';
      drugChoice?: string;
      reasoning: string;
      references: string;
    };
  }[];
}

export interface FlowchartGraph {
  id: string;
  title: string;
  icon: string;
  description: string;
  initialStepId: string;
  steps: Record<string, FlowchartStep>;
}

export interface CaseConsultResponse {
  condition: string;
  antibioticIndicated: boolean;
  confidence: 'HIGH' | 'INTERMEDIATE' | 'LOW';
  clinicalReasoning: string;
  primaryRegimen: {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions: string;
    pearl: string;
  } | null;
  alternativeRegimen: {
    allergyType: string;
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
  } | null;
  symptomaticCare: string[];
  cpgReference: string;
  redFlags: string[];
  investigations: {
    indicated: string[];
    interpretation: string;
  };
  malaysianDoctorScript: {
    english: string;
    bahasaMelayu: string;
  };
  source?: string;
  errorNote?: string;
}
