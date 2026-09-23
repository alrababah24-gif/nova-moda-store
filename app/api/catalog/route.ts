// @ts-nocheck
export async function GET() {
  // نسخة ثابتة مضمونة - بتشتغل حتى لو lib/data فيه مشكلة
  // بعد ما يصير Published بدك، بنرجع للنسخة الديناميكية

  const csv = `id,title,description,availability,condition,price,link,image_link,brand
Abaya-125,عباية موديل 125,عباية انيقة فاخرة,in stock,new,24 JOD,https://novamodaabaya.com/product/Abaya-125,https://novamodaabaya.com/placeholder.jpg,Nova Moda
Abaya-124,عباية موديل 124,عباية كلاسيك,in stock,new,28 JOD,https://novamodaabaya.com/product/Abaya-124,https://novamodaabaya.com/placeholder.jpg,Nova Moda
Abaya-123,عباية موديل 123,عباية عصرية,in stock,new,22 JOD,https://novamodaabaya.com/product/Abaya-123,https://novamodaabaya.com/placeholder.jpg,Nova Moda
`.trim()

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "s-maxage=3600"
    }
  })
}
