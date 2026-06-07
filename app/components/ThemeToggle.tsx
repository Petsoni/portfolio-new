'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { containerVariants, itemVariants } from "@/app/motion-variants";
import { hapticOnEnter } from "@/app/haptics";
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial = saved ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    root.classList.remove('dots-animating');
    // force reflow so the animation restarts on every toggle
    void root.offsetWidth;
    root.classList.add('dots-animating');
  };

  if (!mounted) return null;

  return (
    <motion.div className={"theme-toggle-wrapper"} variants={containerVariants} initial="hidden" animate={"visible"}>
      <motion.button
        variants={itemVariants}
        onAnimationStart={hapticOnEnter}
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>
    </motion.div>
  );
}