export const metadata = { title: 'Aviso legal — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Aviso legal</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Texto pendiente de revisión legal antes de lanzamiento público.
        </p>
        <h2>Titular</h2>
        <p>PCH Obras [CIF, domicilio, datos registrales — añadir antes de producción]</p>
        <h2>Objeto</h2>
        <p>
          La presente web ofrece información sobre los servicios de reforma integral
          de viviendas en Madrid prestados por PCH Obras bajo la marca comercial Cota.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>
          Todo el contenido (textos, imágenes, marca, diseño) es propiedad de
          PCH Obras o se utiliza con autorización.
        </p>
      </div>
    </main>
  );
}
