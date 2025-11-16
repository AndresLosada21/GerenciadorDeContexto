"use client";

export default function Features() {
  const features = [
    {
      icon: "[ CONTEXT_WINDOW_OTIMIZADO ]",
      description: "3 modos de saída: FULL (código completo), COMPACT (estrutura + snippets) e MINIMAL (apenas árvore). Cabe em qualquer janela de contexto.",
      delay: 200
    },
    {
      icon: "[ GITIGNORE_NATIVO ]",
      description: "Lê seu .gitignore automaticamente. node_modules, build artifacts e cache ficam de fora. Apenas código relevante, zero ruído.",
      delay: 300
    },
    {
      icon: "[ PREVIEW_ANTES_COPIAR ]",
      description: "Visualize o Markdown renderizado antes de enviar para a IA. Veja exatamente o que Claude/ChatGPT vai receber.",
      delay: 400
    },
    {
      icon: "[ LAZY_LOADING_EXTREMO ]",
      description: "Projeto com 50.000 arquivos? Carrega em 0.5s, não 18s. Pastas colapsadas não são lidas até você expandir.",
      delay: 500
    },
    {
      icon: "[ 100%_LOCAL ]",
      description: "Roda completamente no navegador. Sem backend, sem upload, sem tracking. Seus dados nunca saem do seu computador.",
      delay: 600
    },
    {
      icon: "[ ZERO_SETUP ]",
      description: "Não precisa instalar nada. Não precisa configurar nada. Abre, seleciona pasta, gera. Pronto em 30 segundos.",
      delay: 700
    }
  ];

  return (
    <section id="features" className="section-padding">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-center" data-aos="fade-up">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="feature-icon">{feature.icon}</div>
              <p className="leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 4rem;
          color: var(--color-primary);
          text-transform: uppercase;
          border: 4px solid var(--color-primary);
          padding: 1rem 1.5rem;
          display: inline-block;
          box-shadow: 8px 8px 0px 0px rgba(255, 255, 0, 0.3);
        }
        .feature-card {
          background-color: var(--color-secondary);
          border: 4px solid var(--color-primary);
          padding: 2rem;
          transition: all 0.15s ease-out;
          box-shadow: 8px 8px 0px 0px var(--color-primary);
          overflow: hidden;
        }
        .feature-card:hover {
          background-color: #111;
          transform: translate(2px, 2px);
          box-shadow: 6px 6px 0px 0px var(--color-primary);
        }
        .feature-icon {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--color-primary);
          font-weight: 700;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
            padding: 0.75rem 1rem;
            box-shadow: 4px 4px 0px 0px rgba(255, 255, 0, 0.3);
          }

          .feature-card {
            padding: 1.5rem;
            box-shadow: 4px 4px 0px 0px var(--color-primary);
          }

          .feature-icon {
            font-size: 1.125rem;
            line-height: 1.4;
          }
        }
      `}</style>
    </section>
  );
}
