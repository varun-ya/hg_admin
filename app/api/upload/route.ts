import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ADMIN_DIR = path.join(process.cwd(), "public", "uploads");
const WEBSITE_DIR = path.join(process.cwd(), "..", "hg_website", "homeguru", "public", "uploads");

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = path.extname(file.name) || ".bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  // Save to both admin and website public folders
  await Promise.all([
    mkdir(ADMIN_DIR, { recursive: true }).then(() => writeFile(path.join(ADMIN_DIR, name), bytes)),
    mkdir(WEBSITE_DIR, { recursive: true }).then(() => writeFile(path.join(WEBSITE_DIR, name), bytes)),
  ]);

  return NextResponse.json({ url: `/uploads/${name}` });
}
