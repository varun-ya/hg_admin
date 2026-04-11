import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BLOGS_JSON = path.resolve(process.cwd(), "../hg_website/homeguru/src/lib/blogs.json");

function readBlogs() {
  try {
    if (fs.existsSync(BLOGS_JSON)) return JSON.parse(fs.readFileSync(BLOGS_JSON, "utf-8"));
  } catch {}
  return [];
}

function writeBlogs(blogs: any[]) {
  const dir = path.dirname(BLOGS_JSON);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(BLOGS_JSON, JSON.stringify(blogs, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json({ success: true, data: readBlogs() });
}

export async function POST(req: NextRequest) {
  const { action, blog, blogId, blogs } = await req.json();
  const all = readBlogs();

  if (action === "save_all") { writeBlogs(blogs); return NextResponse.json({ success: true }); }
  if (action === "create") { all.push(blog); writeBlogs(all); return NextResponse.json({ success: true, data: blog }); }
  if (action === "update") {
    const idx = all.findIndex((b: any) => b.slug === blogId);
    if (idx === -1) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    all[idx] = { ...all[idx], ...blog };
    writeBlogs(all);
    return NextResponse.json({ success: true, data: all[idx] });
  }
  if (action === "delete") { writeBlogs(all.filter((b: any) => b.slug !== blogId)); return NextResponse.json({ success: true }); }

  return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
}
