import { useReducedMotion } from 'framer-motion'

// Named spring presets — each section of the app has its own feel
export const springs = {
  // Landing hero: soft, floaty — feels editorial
  hero:   { type: 'spring', stiffness: 160, damping: 22, mass: 1 },
  // Dashboard cards: medium snap — responsive but not jarring
  card:   { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
  // Modals / overlays: quick and precise — decisive
  modal:  { type: 'spring', stiffness: 420, damping: 38, mass: 0.6 },
  // Page-level transitions: easing curve, not spring — feels like navigation
  page:   { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  // Sidebar / panel: smooth slide — infrastructure, not UI
  panel:  { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 },
  // Chat messages: quick pop — conversational rhythm
  chat:   { type: 'spring', stiffness: 380, damping: 32, mass: 0.5 },
  // Header entrance: easing — structural, one-shot
  header: { duration: 0.2, ease: [0.0, 0, 0.2, 1] },
}

const instant = { duration: 0.001 }

export function useMotion() {
  const reduced = useReducedMotion()

  const t = (spring) => (reduced ? instant : spring)

  /** Fade up from below — most common entrance */
  const fadeUp = (delay = 0, spring = 'card') => ({
    initial:    { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    animate:    { opacity: 1, y: 0 },
    transition: reduced ? instant : { ...springs[spring], delay },
  })

  /** Pure fade — for things that shouldn't move */
  const fadeIn = (delay = 0) => ({
    initial:    { opacity: reduced ? 1 : 0 },
    animate:    { opacity: 1 },
    transition: reduced ? instant : { duration: 0.3, ease: 'easeOut', delay },
  })

  /** Scale + fade — modals, popovers */
  const scaleIn = (delay = 0) => ({
    initial:    { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 12 },
    animate:    { opacity: 1, scale: 1, y: 0 },
    exit:       { opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 8, transition: instant },
    transition: reduced ? instant : { ...springs.modal, delay },
  })

  /** Slide in from a side */
  const slideIn = (from = 'left', delay = 0) => {
    const axis = from === 'left' || from === 'right' ? 'x' : 'y'
    const sign = from === 'right' || from === 'bottom' ? 1 : -1
    return {
      initial:    { opacity: reduced ? 1 : 0, [axis]: reduced ? 0 : sign * 20 },
      animate:    { opacity: 1, [axis]: 0 },
      transition: reduced ? instant : { ...springs.panel, delay },
    }
  }

  /** Stagger container — wrap a list of children */
  const stagger = (staggerChildren = 0.07, delayChildren = 0) => ({
    animate: { transition: reduced ? {} : { staggerChildren, delayChildren } },
  })

  /** Hover/tap interaction props — cards, buttons */
  const interactive = (scale = 1.02) =>
    reduced
      ? {}
      : { whileHover: { scale }, whileTap: { scale: scale - 0.03 }, transition: t(springs.card) }

  return { reduced, fadeUp, fadeIn, scaleIn, slideIn, stagger, interactive, springs, t }
}
