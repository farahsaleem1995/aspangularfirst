import { Contact } from "./contact.model";
import { Make } from "./make.model";
import { KeyValuePair } from "./key-value-pair.model";

export interface Vehicle {
  id: number;
  make: Make;
  model: KeyValuePair;
  isRegistered: boolean;
  features: KeyValuePair[];
  contact: Contact;
  lastUpdate: string;
}
