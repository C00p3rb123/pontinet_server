export type illnessDescription ={
    segment: string,
    segmentDetails: string,
    mechanism: string,
    mechanismDetails: string,

}

export type GeneralInstructions = {
    diagnosticImpression: string,
    onSiteProcedure?: string,
    onSiteMedication?: string,
    other: string
}

export type DischargeInstructions = {
    generalIndications: string,
    medication?: string,
    referralDetails?: string,
    followUpDetails?: string,
    other: string,
}

export type PatientInformation = {
    age: number,  
    illnessDescription: illnessDescription,
    gp: string,
    gpMobile: string
    extraInformation?: string
    clinic?: string    
}
export type InitialCase= {
    _id: string,
    patientInformation: PatientInformation
}

export type SpecialistInfo = {
    id: string,
    name: string
}
export type SpecialisationResponse = {
    generalInstructions: GeneralInstructions,
    dischargeInstructions: DischargeInstructions,
    specialist: SpecialistInfo,
    createdAt: string;
}
export type Case = InitialCase & SpecialisationResponse
