import { ToString } from "src/lib/common";
import { LoginDto } from "./login.dto";
import { Register } from "@shared/src/types/users-section/dto.types";


export class RegisterDto extends LoginDto implements Register {
  @ToString({ required: true, description: "First name", example: "John", min: 1, max: 512 })
  first_name!: string;

  @ToString({ required: true, description: "Last name", example: "Doe", min: 1, max: 1024 })
  last_name!: string;

  @ToString({ required: false, description: "Phone number", example: "+12345678901", min: 1, max: 1024 })
  phone_number?: string;
}