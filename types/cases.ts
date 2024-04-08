export type illnessDescription ={
    segment: string,
    segmentDetails: string,
    mechanism: string,
    mechanismDetails: string,

}

export type GeneralInstructions = {
    diagnosticImpression: string,
    onSiteProcedure?: string,
    onSiteMedication?: string
}

export type DischargeInstructions = {
    generalIndications: string,
    medication?: string,
    referalDetails?: string,
    followUpDetails?: string
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
export type SpecialisationResponse = {
    generalInstructions: GeneralInstructions,
    dischargeInstructions: DischargeInstructions,
    specialist: string
}
export type Case = InitialCase & SpecialisationResponse
