"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Selecione Seu Projeto",
      description: "Clique em \"Selecionar\" e escolha a pasta raiz. A ferramenta lê seu .gitignore automaticamente e já deixa node_modules/build folders colapsados.",
      color: "var(--color-accent-download)"
    },
    {
      number: "2",
      title: "Escolha o Que Incluir",
      description: "Árvore interativa mostra todos os arquivos. Marque/desmarque com checkboxes. Expanda apenas o que precisa — lazy loading garante velocidade.",
      color: "var(--color-accent-go)"
    },
    {
      number: "3",
      title: "Escolha o Modo de Saída",
      description: "FULL: Código completo para análise profunda. COMPACT: Estrutura + snippets para refatoração. MINIMAL: Apenas árvore de arquivos para planejamento.",
      color: "var(--color-primary)"
    },
    {
      number: "4",
      title: "Preview e Copie",
      description: "Veja o Markdown renderizado antes de copiar. Alterne entre RAW e PREVIEW. Quando estiver pronto, copie e cole direto no Claude/ChatGPT/Cursor.",
      color: "#FF00FF"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-black bg-opacity-20">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-center" data-aos="fade-up">
          Como Funciona
        </h2>
        <div className="max-w-3xl mx-auto mt-16" data-aos="fade-up" data-aos-delay="100">
          {steps.map((step, index) => (
            <div key={index} className="timeline-item mb-8">
              <div className="flex items-center">
                <div
                  className="timeline-icon"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">{step.title}</h3>
              </div>
              <p className="text-gray-400 mt-4 pl-14">{step.description}</p>
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
        .timeline-item {
          position: relative;
          background: var(--color-secondary);
          border: 4px solid var(--color-accent-download);
          padding: 1.5rem;
          box-shadow: 6px 6px 0px 0px var(--color-accent-download);
          transition: all 0.15s ease-out;
        }
        .timeline-item:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px var(--color-accent-download);
        }
        .timeline-icon {
          display: inline-flex;
          width: 2.5rem;
          height: 2.5rem;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary);
          margin-right: 1rem;
        }
      `}</style>
    </section>
  );
}
