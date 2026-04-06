export const metadata = { title: 'Política de privacidad — Cota' };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl mb-8">Política de privacidad</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-warning">
          ⚠️ Pendiente de revisión legal antes de lanzamiento público.
        </p>
        <h2>Responsable del tratamiento</h2>
        <p>PCH Obras [+ datos legales completos a añadir antes de producción]</p>
        <h2>Datos recogidos</h2>
        <p>
          Cuando completas el diagnóstico recogemos: nombre, email, teléfono y las
          respuestas del cuestionario. Estos datos se usan exclusivamente para
          contactarte respecto a tu reforma.
        </p>
        <h2>Base legal</h2>
        <p>Consentimiento del interesado (art. 6.1.a RGPD).</p>
        <h2>Conservación</h2>
        <p>
          Tus datos se conservan durante 12 meses desde el último contacto, salvo
          que solicites su eliminación antes.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes acceder, rectificar, oponerte o solicitar la eliminación de tus
          datos escribiendo a info@cotamadrid.com.
        </p>
      </div>
    </main>
  );
}
