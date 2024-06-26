import { InternshipType } from "./internship-type";
import { Parcour } from "./parcour";
import { Training } from "./training";

export interface TrainingType {
   
    niveau_formation_id? : number; //formation not fomation to change in the database as soon as possible 
    code_niveau_formation: number;
    lib_niveau_formation_ara?: string;
    lib_niveau_formation_fr: string;
    type_stage_id: number;
    formation_id: number;
    parcour_id: number;
    training: Training;
    internshipType : InternshipType;
    parcour : Parcour;

    
    // stage: internship;
    
}
