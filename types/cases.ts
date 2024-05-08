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
    gp: string
    clinic?: string
    referralDate: string;
}
export type InitialCase= {
    patientInformation: PatientInformation
}

export type SpecialistInfo = {
    id: string,
    name: string
}
export type SpecialisationResponse = {
    generalInstructions: GeneralInstructions,
    dischargeInstructions: DischargeInstructions,
    specialist: SpecialistInfo
}
export type Case = InitialCase & SpecialisationResponse
