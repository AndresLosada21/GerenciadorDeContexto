"use client";

export default function Footer() {
  return (
    <footer className="py-10 mt-16 border-t-4 border-primary">
      <div className="container mx-auto px-6 text-center text-gray-400">
        <a href="#hero" className="text-2xl font-extrabold tracking-tighter mb-4 inline-block uppercase">
          Markdown<span className="text-primary">{'//'}/</span>Assembler
        </a>
        <p className="text-sm text-gray-500 mt-1">
          &copy; 2025 {'//'} Design Neo-Brutalista {'//'} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
