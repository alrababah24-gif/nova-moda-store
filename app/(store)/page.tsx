export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'white', padding: '80px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Nova Moda Abaya</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>الموقع شغال الآن ✅</p>
      <p style={{ color: '#999', fontSize: '14px' }}>جاري استرجاع المنتجات... الصفحة سترجع خلال دقائق</p>
      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{ background: 'black', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>تحديث الصفحة</a>
      </div>
    </div>
  );
}
