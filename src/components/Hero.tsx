"use client";

export default function Hero() {
  return (
    <section id="hero" className="pt-20">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Alimente IAs com
          <br />
          <span
            className="text-primary"
            style={{
              textShadow: '4px 4px 0px #000, 8px 8px 0px #FF00FF'
            }}
          >
            Contexto Perfeito
          </span>
        </h1>
        <p
          className="text-lg md:text-xl lg:text-2xl mt-6 mb-10 max-w-4xl mx-auto leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Transforme seu projeto em Markdown otimizado para <span className="text-primary font-bold">Claude</span>, <span className="text-primary font-bold">ChatGPT</span> e <span className="text-primary font-bold">Copilot</span>.
          <br />
          <span className="text-gray-400">Sem copiar/colar manual. Sem formatação. Apenas contexto limpo.</span>
        </p>
        <a
          href="#try-it-now"
          className="btn-primary text-lg uppercase inline-block"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          Gerar Meu Contexto →
        </a>
      </div>

      <style jsx>{`
        .btn-primary {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          font-weight: 700;
          padding: 0.75rem 2rem;
          border: 3px solid var(--color-secondary);
          box-shadow: 6px 6px 0px 0px var(--color-secondary);
          transition: all 0.15s ease-out;
        }
        .btn-primary:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
        }
      `}</style>
    </section>
  );
}
