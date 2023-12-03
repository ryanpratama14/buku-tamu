import { z } from "zod";

const pagination = z.object({ page: z.number().min(1), limit: z.number().min(1).optional() });
const order = z.enum(["asc", "desc"]).optional();

export class schema {
  static login = z.object({ email: z.string(), password: z.string().min(6) });

  static user = class {
    static create = z.object({
      name: z.string().min(4),
      email: z.string().email(),
      password: z.string().min(6),
    });
  };

  // static position = class {
  //   static list = z.object({ params: z.object({ search: z.string().optional() }) }).optional();
  //   static create = z.object({ name: z.string().min(1) });
  //   static detail = z.object({ id: z.string() });
  //   static update = z.object({ id: this.detail.shape.id, body: this.create });
  // };
}

export type Pagination = z.infer<typeof pagination>;
export type Login = z.infer<typeof schema.login>;
