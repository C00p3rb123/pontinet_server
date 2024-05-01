import { Case } from "../types/cases"
export const mockCase: Case = {
    patientInformation: {
        name: "Person 1",
        age: 18,
        description: "Lower leg broken",
        gp: "Dr Tester",
        clinic: "Health Clinic",
        referralDate: "19/10/2023",
        
    },
    generalInstructions: {
        diagnosticImpression: `Cillum laboris est velit et sin.`,
        onSiteProcedure: `Nulla excepteur anim ullamco laborum.`,
        onSiteMedication: `Non commodo Lorem magna ad dolore.`
    },
    dischargeInstructions: {
        generalIndications: `Elit mollit fugiat esse voluptate.`,
        medication: `Ex nulla ex consequat et laboris nulla anim.`,
        referralDetails: `Do tempor in occaecat et quis voluptate.`,
        followUpDetails: `Eiusmod eu cupidatat voluptate ea sint.`
    }
}
