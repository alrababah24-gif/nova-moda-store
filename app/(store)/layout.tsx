export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function StoreLayout({
  children,
  cart,
  products,
  modal,
}: {
  children: React.ReactNode;
  cart?: React.ReactNode;
  products?: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <>
      {children}
      {cart}
      {products}
      {modal}
    </>
  );
}
