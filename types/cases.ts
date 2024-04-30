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
    referalDetails?: string,
    followUpDetails?: string,
    other: string,
}

export type PaitentInformation = {
    age: number,  
    illnessDescription: illnessDescription,
    gp: string
    clinic?: string
    referalDate: string;
}


export type InitialCase= {
    paitentInformation: PaitentInformation
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
