import { OrderAddressFields } from "../models/order/order-interfaces";
import { inputNames } from "./enums/input-names";

export const capitalize = (value: string): string => {
  if (value !== undefined) {
    return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
  }
  return "";
};

export const capitalizeAddress = (
  address: OrderAddressFields
): OrderAddressFields => {
  const capAddress = { ...address };
  for (let [k, v] of Object.entries(address)) {
    switch (k) {
      case inputNames.address_1:
      case inputNames.address_2:
      case inputNames.first_name:
      case inputNames.last_name:
      case inputNames.city:
        capAddress[k] = capitalize(v);
        break;
      default:
        break;
    }
  }
  return capAddress;
};
