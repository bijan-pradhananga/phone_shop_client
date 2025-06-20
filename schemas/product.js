import * as z from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  price: z
    .preprocess((val) => parseFloat(val),
      z.number().positive("Price must be greater than 0")),
  brand: z
    .string()
    .min(1, "Brand is required"), // Should be a valid ObjectId (string)
  stock: z
    .preprocess((val) => parseInt(val),
      z.number().nonnegative("Stock must be 0 or more")),
  specifications: z.object({
    ram_capacity: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("RAM capacity must be greater than 0")),
    internal_memory: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("Internal memory must be greater than 0")),
    screen_size: z
      .preprocess((val) => parseFloat(val),
        z.number().positive("Screen size must be greater than 0")),
    battery_capacity: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("Battery capacity must be greater than 0")),
    processor: z
      .string()
      .min(1, "Processor is required"),
    primary_camera_rear: z
      .preprocess((val) => parseInt(val),
        z.number().int().nonnegative("Rear camera resolution must be 0 or more")),
    primary_camera_front: z
      .preprocess((val) => parseInt(val),
        z.number().int().nonnegative("Front camera resolution must be 0 or more")),
  }),
  images: z
    .any()
    .refine((files) =>
      files instanceof FileList && files.length <= 5,
      "You can upload up to 5 images only"),
});



export const editProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  price: z
    .preprocess((val) => parseFloat(val),
      z.number().positive("Price must be greater than 0")),
  brand: z
    .string()
    .min(1, "Brand is required"),
  stock: z
    .preprocess((val) => parseInt(val),
      z.number().nonnegative("Stock must be 0 or more")),
  specifications: z.object({
    ram_capacity: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("RAM capacity must be greater than 0")),
    internal_memory: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("Internal memory must be greater than 0")),
    screen_size: z
      .preprocess((val) => parseFloat(val),
        z.number().positive("Screen size must be greater than 0")),
    battery_capacity: z
      .preprocess((val) => parseInt(val),
        z.number().int().positive("Battery capacity must be greater than 0")),
    processor: z
      .string()
      .min(1, "Processor is required"),
    primary_camera_rear: z
      .preprocess((val) => parseInt(val),
        z.number().int().nonnegative("Rear camera resolution must be 0 or more")),
    primary_camera_front: z
      .preprocess((val) => parseInt(val),
        z.number().int().nonnegative("Front camera resolution must be 0 or more")),
  }),
});
