import type { Request, Response, NextFunction } from "express"
import { v2 as cloudinary } from "cloudinary"
import { env } from "../../env.js"

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file provided" })
      return
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "keytester/ads",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      },
      (error, result) => {
        if (error || !result) {
          next(error ?? new Error("Cloudinary upload failed"))
          return
        }
        res.json({
          success: true,
          data: { url: result.secure_url, publicId: result.public_id },
        })
      }
    )

    stream.end(req.file.buffer)
  } catch (err) {
    next(err)
  }
}
