// filepath: d:/PROYECTOS/REMATE CAMPO/app/reglamento/page.tsx
// @optimization: seo-audit - Reglamento del remate como página estática de alta legibilidad, semántica clara y accesibilidad nativa

import React from 'react'
import type { Metadata } from 'next'
import { FileText, ShieldAlert, Award, Clock, DollarSign, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pliego de Condiciones y Reglamento',
  description: 'Conozca las reglas de negocio, comisiones, plazos y condiciones legales de nuestras subastas agrícolas virtuales en Uruguay.',
}

export default function ReglamentoPage() {
  return (
    <article className="max-w-4xl mx-auto flex flex-col gap-8 py-6">
      
      {/* Cabecera de Página */}
      <div className="flex flex-col gap-2 border-b border-neutral-200 pb-6">
        <h1 className="text-3xl md:text-5xl font-display font-black text-[var(--color-earth)] tracking-tight">
          Reglamento General de la Subasta
        </h1>
        <p className="text-neutral-500 font-sans text-base leading-relaxed">
          Pliego de condiciones particulares y bases de contratación para el remate virtual de maquinaria agrícola en Uruguay.
        </p>
      </div>

      {/* Reglas de Negocio en Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comisión */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium flex gap-4">
          <div className="p-3 bg-[var(--color-cream)] rounded-xl h-max text-[var(--color-forest)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display font-extrabold text-lg text-[var(--color-earth)]">Comisiones de Compra</h3>
            <p className="text-neutral-600 font-sans text-sm leading-relaxed">
              Se adicionará una comisión de adjudicación obligatoria sobre el precio de martillo:
            </p>
            <ul className="list-disc pl-5 text-neutral-600 font-sans text-sm flex flex-col gap-1 mt-1">
              <li><strong>12% IVA Incluido:</strong> Pago al contado vía transferencia bancaria o efectivo.</li>
              <li><strong>19% IVA Incluido:</strong> Pago mediante tarjeta o links de Mercado Pago.</li>
            </ul>
          </div>
        </div>

        {/* Regla de la última hora */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium flex gap-4">
          <div className="p-3 bg-[var(--color-cream)] rounded-xl h-max text-[var(--color-forest)]">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display font-extrabold text-lg text-[var(--color-earth)]">Regla de la Última Hora</h3>
            <p className="text-neutral-600 font-sans text-sm leading-relaxed">
              Durante la hora final del remate (de 19:00 a 20:00 del día de cierre), <strong>únicamente podrán seguir ofertando en un lote aquellos postores que hayan registrado al menos una puja previa en ese mismo lote antes de las 19:00</strong>. Esto evita especulaciones de último segundo de bidders que no mostraron interés previo.
            </p>
          </div>
        </div>

        {/* Prórrogas automáticas */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium flex gap-4">
          <div className="p-3 bg-[var(--color-cream)] rounded-xl h-max text-[var(--color-forest)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display font-extrabold text-lg text-[var(--color-earth)]">Prórroga Automática (Anti-Sniping)</h3>
            <p className="text-neutral-600 font-sans text-sm leading-relaxed">
              Toda oferta ingresada cuando queden menos de 10 minutos para el cierre del lote extenderá automáticamente el horario de finalización a <strong>10 minutos adicionales</strong>. El proceso se repetirá de forma consecutiva e indefinida mientras continúen ingresando ofertas competitivas.
            </p>
          </div>
        </div>

        {/* Plazos de retiro */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium flex gap-4">
          <div className="p-3 bg-[var(--color-cream)] rounded-xl h-max text-[var(--color-forest)]">
            <Truck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display font-extrabold text-lg text-[var(--color-earth)]">Liquidación & Retiro</h3>
            <p className="text-neutral-600 font-sans text-sm leading-relaxed">
              Una vez adjudicado el lote, las pautas de liquidación son:
            </p>
            <ul className="list-disc pl-5 text-neutral-600 font-sans text-sm flex flex-col gap-1 mt-1">
              <li>El adjudicatario tiene <strong>24 horas hábiles</strong> para coordinar el pago.</li>
              <li>El retiro físico del equipo debe realizarse en un plazo máximo de <strong>7 días de corrido</strong> posterior al pago.</li>
              <li>Los gastos de flete y traslado corren por cuenta exclusiva del comprador.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cuerpo de Pliego Legal */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-premium flex flex-col gap-6 font-sans text-sm text-neutral-700 leading-relaxed">
        <h2 className="font-display font-black text-xl text-[var(--color-earth)] border-b border-neutral-100 pb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--color-forest)]" />
          <span>Condiciones Generales de Contratación</span>
        </h2>

        <div className="flex flex-col gap-4">
          <p>
            <strong>1. Aceptación del Pliego:</strong> El solo hecho de ingresar una oferta en la plataforma implica el pleno conocimiento y aceptación incondicional de todas y cada una de las condiciones estipuladas en el presente reglamento.
          </p>
          <p>
            <strong>2. Identidad y Cookies:</strong> Para simplificar el proceso, las ofertas se realizan sin necesidad de registro formal, asociándose a la sesión digital del navegador del usuario. El postor garantiza la veracidad de los datos de contacto ingresados (Teléfono, Email y Nombre), los cuales revisten carácter de declaración jurada.
          </p>
          <p>
            <strong>3. Carácter Irrevocable:</strong> Toda puja confirmada en el sistema es firme e irrevocable. El postor no podrá anular ni retractarse de su oferta bajo ningún pretexto.
          </p>
          <p>
            <strong>4. Incumplimiento del Comprador:</strong> En caso de que el postor ganador no concrete el pago en las 24 horas correspondientes, se considerará incumplimiento de contrato, facultando al rematador a adjudicar el lote al segundo mejor postor, o reiniciar la subasta, sin perjuicio de las acciones legales por daños y perjuicios y la suspensión permanente del usuario.
          </p>
        </div>
      </div>

    </article>
  )
}
