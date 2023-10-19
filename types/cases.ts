
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
    name: string
    age: number,  
    description: string,
    gp: string
    clinic: string
    referalDate: string;
}

export type Case = {
    generalInstructions: GeneralInstructions,
    dischargeInstructions: DischargeInstructions,
    paitentInformation: PaitentInformation
}

