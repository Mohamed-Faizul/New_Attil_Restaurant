'use client';

import { cloneElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

function DishImage({ dish, compact = false }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-[#8b9b68]/30 bg-[#e9e4c9] ${compact ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(max-width: 768px) 84vw, 40vw"
        className="object-cover"
      />
    </div>
  );
}

function PaperPage({ children, className = '' }) {
  return (
    <div
      className={`relative flex min-w-0 flex-col bg-[#f8f2dc] p-5 text-[#193c20] sm:p-7 md:p-9 ${className}`}
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(91,117,65,0.035) 0px, rgba(91,117,65,0.035) 1px, transparent 1px, transparent 5px), radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.72), transparent 65%)',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export default function MenuBook({ cuisine, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [turn, setTurn] = useState(null);
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStartX = useRef(null);
  const turnLockRef = useRef(false);
  const dishes = cuisine.dishes || [];
  const currentDish = dishes[pageIndex];

  const beginTurn = (direction) => {
    if (turnLockRef.current) return;
    const nextIndex = pageIndex + (direction === 'next' ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= dishes.length) return;
    turnLockRef.current = true;
    setTurn({ direction, from: pageIndex, to: nextIndex });
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key === 'ArrowRight' && pageIndex < dishes.length - 1 && !turn) {
        event.preventDefault();
        beginTurn('next');
        return;
      }
      if (event.key === 'ArrowLeft' && pageIndex > 0 && !turn) {
        event.preventDefault();
        beginTurn('previous');
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll('button:not(:disabled)'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, pageIndex, dishes.length, turn, beginTurn]);

  if (!currentDish) return children;

  const finishTurn = (viewport) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if ((viewport === 'mobile') !== isMobile) return;
    if (!turn) return;
    setPageIndex(turn.to);
    setTurn(null);
    turnLockRef.current = false;
  };

  const renderImagePage = (dish, compact = false) => (
    <PaperPage className="justify-center">
      <DishImage dish={dish} compact={compact} />
      <h3 className="mt-5 font-display text-2xl font-bold leading-tight sm:text-3xl">{dish.name}</h3>
      <span className="mt-2 h-1 w-12 rounded-full bg-[#c49a2e]" />
    </PaperPage>
  );

  const renderInfoPage = (dish) => (
    <PaperPage className="justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#71804b]">{cuisine.name}</p>
        <h3 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">{dish.name}</h3>
        <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-[#35513a] sm:text-base">
          {dish.description}
        </p>
      </div>
      <p className="mt-8 border-t border-[#9ea77b]/40 pt-4 text-lg font-extrabold text-[#597128]">
        {dish.price !== undefined && dish.price !== null ? `₹${Number(dish.price).toLocaleString('en-IN')}` : 'Ask us for today’s price'}
      </p>
    </PaperPage>
  );

  const renderMobilePage = (dish) => (
    <PaperPage className="justify-center">
      <DishImage dish={dish} compact />
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#71804b]">{cuisine.name}</p>
      <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{dish.name}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#35513a]">{dish.description}</p>
      <p className="mt-4 font-extrabold text-[#597128]">
        {dish.price !== undefined && dish.price !== null ? `₹${Number(dish.price).toLocaleString('en-IN')}` : 'Ask us for today’s price'}
      </p>
    </PaperPage>
  );

  const trigger = cloneElement(children, {
    ref: (node) => {
      triggerRef.current = node;
    },
    'aria-haspopup': 'dialog',
    onClick: (event) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setPageIndex(0);
        setIsOpen(true);
      }
    },
    onKeyDown: (event) => {
      children.props.onKeyDown?.(event);
      if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setPageIndex(0);
        setIsOpen(true);
      }
    },
  });

  const modal = typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
      <motion.div
        key="menu-book-backdrop"
        className="cursor-hide fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#dce7c9]/60 px-3 py-5 backdrop-blur-md sm:px-6"
        style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(255,249,225,0.74), rgba(71,105,49,0.24))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.24 }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <motion.section
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-book-title"
          tabIndex={-1}
          className="relative my-auto w-full max-w-[1000px] outline-none"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, y: 8 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const difference = event.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (difference < -55) beginTurn('next');
            if (difference > 55) beginTurn('previous');
          }}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 id="menu-book-title" className="font-display text-xl font-bold text-[#193c20] sm:text-2xl">
              {cuisine.name}
            </h2>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu book"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#54703b]/30 bg-[#f8f2dc] text-2xl font-semibold leading-none text-[#193c20] shadow-[0_3px_10px_rgba(36,66,29,0.16)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#597128]"
            >
              ×
            </button>
          </div>

          <div
            className="relative rounded-[1.35rem] p-2 shadow-[0_24px_65px_rgba(35,65,28,0.28)] sm:p-3"
            style={{
              perspective: '1600px',
              background: 'linear-gradient(135deg, #d4ad43 0%, #52733a 24%, #9e7a25 52%, #31572f 76%, #d4ad43 100%)',
            }}
          >
            <div className="relative grid min-h-[430px] overflow-hidden rounded-[0.85rem] border border-[#8b762e]/45 bg-[#f8f2dc] md:min-h-[520px] md:grid-cols-2">
              <div
                role="button"
                tabIndex={0}
                aria-label="Previous dish"
                onClick={() => beginTurn('previous')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    beginTurn('previous');
                  }
                }}
                className={`group/page relative hidden min-w-0 md:block ${pageIndex > 0 ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {renderImagePage(currentDish)}
                {pageIndex > 0 && (
                  <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#52733a]/10 px-3 py-1 text-xs font-extrabold text-[#52733a] opacity-0 transition-opacity group-hover/page:opacity-100">
                    Prev
                  </span>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                aria-label="Next dish"
                onClick={() => beginTurn('next')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    beginTurn('next');
                  }
                }}
                className={`group/page relative hidden min-w-0 md:block ${pageIndex < dishes.length - 1 ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {renderInfoPage(currentDish)}
                {pageIndex < dishes.length - 1 && (
                  <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-[#52733a]/10 px-3 py-1 text-xs font-extrabold text-[#52733a] opacity-0 transition-opacity group-hover/page:opacity-100">
                    Next
                  </span>
                )}
              </div>
              <div className="relative min-w-0 md:hidden">
                {renderMobilePage(currentDish)}
                {pageIndex > 0 ? (
                  <button
                    type="button"
                    aria-label="Previous dish"
                    onClick={(event) => {
                      event.stopPropagation();
                      beginTurn('previous');
                    }}
                    className="group/zone absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer bg-transparent"
                  >
                    <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#52733a]/10 px-3 py-1 text-xs font-extrabold text-[#52733a] opacity-0 transition-opacity group-hover/zone:opacity-100">
                      Prev
                    </span>
                  </button>
                ) : (
                  <div aria-hidden="true" className="absolute inset-y-0 left-0 z-10 w-1/2" />
                )}
                {pageIndex < dishes.length - 1 ? (
                  <button
                    type="button"
                    aria-label="Next dish"
                    onClick={(event) => {
                      event.stopPropagation();
                      beginTurn('next');
                    }}
                    className="group/zone absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer bg-transparent"
                  >
                    <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-[#52733a]/10 px-3 py-1 text-xs font-extrabold text-[#52733a] opacity-0 transition-opacity group-hover/zone:opacity-100">
                      Next
                    </span>
                  </button>
                ) : (
                  <div aria-hidden="true" className="absolute inset-y-0 right-0 z-10 w-1/2" />
                )}
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 hidden w-5 -translate-x-1/2 bg-gradient-to-r from-[#52603c]/0 via-[#52603c]/20 to-[#fff9e7]/50 md:block"
              />

              {turn && (
                <>
                  <motion.div
                    key={`desktop-turn-${turn.from}-${turn.to}`}
                    className={`absolute bottom-0 top-0 z-20 hidden w-1/2 md:block ${turn.direction === 'next' ? 'right-0' : 'left-0'}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: turn.direction === 'next' ? 'left center' : 'right center',
                      boxShadow: turn.direction === 'next' ? '-12px 0 22px rgba(46,66,34,0.18)' : '12px 0 22px rgba(46,66,34,0.18)',
                    }}
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={reduceMotion ? { opacity: [0, 1, 0] } : { rotateY: turn.direction === 'next' ? -180 : 180 }}
                    transition={{ duration: reduceMotion ? 0.7 : 0.7, ease: [0.42, 0, 0.58, 1] }}
                    onAnimationComplete={() => finishTurn('desktop')}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                      {turn.direction === 'next' ? renderInfoPage(dishes[turn.from]) : renderImagePage(dishes[turn.from])}
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden', transform: `rotateY(${turn.direction === 'next' ? 180 : -180}deg)` }}
                    >
                      {turn.direction === 'next' ? renderImagePage(dishes[turn.to]) : renderInfoPage(dishes[turn.to])}
                    </div>
                  </motion.div>

                  <motion.div
                    key={`mobile-turn-${turn.from}-${turn.to}`}
                    className="absolute inset-0 z-20 md:hidden"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: turn.direction === 'next' ? 'left center' : 'right center',
                      boxShadow: turn.direction === 'next' ? '-12px 0 22px rgba(46,66,34,0.2)' : '12px 0 22px rgba(46,66,34,0.2)',
                    }}
                    initial={{ rotateY: 0, opacity: 1 }}
                    animate={reduceMotion ? { opacity: [0, 1, 0] } : { rotateY: turn.direction === 'next' ? -180 : 180 }}
                    transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
                    onAnimationComplete={() => finishTurn('mobile')}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                      {renderMobilePage(dishes[turn.from])}
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden', transform: `rotateY(${turn.direction === 'next' ? 180 : -180}deg)` }}
                    >
                      {renderMobilePage(dishes[turn.to])}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-[#193c20]">
            <p className="text-sm font-extrabold tabular-nums">page {pageIndex + 1} / {dishes.length}</p>
            {pageIndex === dishes.length - 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(false);
                }}
                className="rounded-full bg-[#52733a] px-5 py-3 text-sm font-extrabold text-[#fff7dc] shadow-sm transition hover:bg-[#3d602f]"
              >
                Back to menu
              </button>
            )}
          </div>
        </motion.section>
      </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  ) : null;

  return <>{trigger}{modal}</>;
}