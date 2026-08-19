export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atmosphere-word atmosphere-word-one">NOVA</div>
      <div className="atmosphere-word atmosphere-word-two">MODA</div>
      <div className="atmosphere-orbit atmosphere-orbit-one" />
      <div className="atmosphere-orbit atmosphere-orbit-two" />
      <svg className="atmosphere-signature" viewBox="0 0 800 500" fill="none" preserveAspectRatio="none">
        <path d="M40 390C150 110 285 70 390 270C500 475 620 420 760 80" />
        <path d="M72 430C210 180 320 170 414 318C510 470 635 408 735 140" />
      </svg>
    </div>
  );
}
