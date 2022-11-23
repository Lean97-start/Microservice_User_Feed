import { IUser } from "../Interface/UserReq.Interface";

export function createUserReadis(): IUser {
  return {
    id: "637e6c890e76c96cd8b4d5bd",
    name: "pepe",
    login: "pepe",
    permissions: ["user"],
  };
}
