export default function NotFound() {
  return (
    <main id="contenido" className="hero">
      <div className="prism-line" aria-hidden="true" />
      <p className="hero-eyebrow">404</p>
      <h1 className="hero-title">No encontrado / Not found</h1>
      <p className="mt-8 flex flex-wrap justify-center gap-4">
        <a href="/es#carrusel" className="flux-btn" lang="es">
          Volver a la oferta
        </a>
        <a href="/en#carrusel" className="flux-btn" lang="en">
          Back to offerings
        </a>
      </p>
    </main>
  )
}
