let activeCategory: string | null = null;

export async function GET() {
  return Response.json({ category: activeCategory });
}

export async function POST(req: Request) {
  const { category } = await req.json();
  activeCategory = category;
  return Response.json({ success: true });
}
