import { z } from "zod";

export const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export class schema {
  // enums
  static gender = z.enum(["MALE", "FEMALE"]);
  static order = z.enum(["asc", "desc"]).optional();
  static status = z.enum(["DRAFT", "VISITING", "DONE"]);

  static pagination = z.object({ page: z.number().min(1), limit: z.number().min(1).optional() });
  static email = z.string().email("Please provide a valid email");
  static fullName = z
    .string()
    .min(1, "Please provide your name")
    .regex(/^[A-Za-z\s]+$/, "Masukkan nama Anda");

  static phoneNumber = z
    .string()
    .regex(/^\d+$/, "Please provide a valid phone number")
    .regex(/^8/, "Please start with number 8")
    .min(10, "At least 10 characters")
    .max(12);

  static date = z.string().min(1, "Silakan pilih tanggal");
  static password = z.string().min(6, "Minimal 6 karakter");
  static login = z.object({ username: z.string(), password: schema.password }); // also for next-auth

  static user = class {};
  static visit = class {
    static create = z.object({
      visitorName: z.string(),
      visitorCompany: z.string(),
      description: z.string(),
      phoneNumber: z.string(),
      startDate: z.string().optional(),
      startTime: z.string().optional(),
    });

    static list = z.object({
      pagination: schema.pagination,
      params: z.object({
        status: schema.status.optional(),
        search: z.string().optional(),
      }),
    });
  };
}

export type Pagination = z.infer<typeof schema.pagination>;
export type Login = z.infer<typeof schema.login>;
