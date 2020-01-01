import { Contact } from "./contact.model";
import { Make } from "./make.model";
import { KeyValuePair } from "./key-value-pair.model";

export interface SaveVehicle {
  id: number;
  makeId: number;
  modelId: number;
  isRegistered: boolean;
  features: number[];
  contact: Contact;
}
