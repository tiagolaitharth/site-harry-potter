import { useCallback, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export function ScrollStackItem({ children, itemClassName = '' }) {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>
      {children}
    </div>
  );
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 88,
  itemScale = 0.02,
  itemStackDistance = 24,
  stackPosition = '14%',
  scaleEndPosition = '6%',
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const stackCompletedRef = useRef(false);
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    return (scrollTop - start) / Math.max(end - start, 1);
  }, []);

  const parsePosition = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (Number.parseFloat(value) / 100) * containerHeight;
    }
    return Number.parseFloat(value) || 0;
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }

    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? window.innerHeight,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        let offset = 0;
        let current = element;
        while (current) {
          offset += current.offsetTop || 0;
          current = current.offsetParent;
        }
        return offset;
      }
      return element.offsetTop;
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePosition(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePosition(scaleEndPosition, containerHeight);
    const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    let topCardIndex = 0;
    cardsRef.current.forEach((card, index) => {
      const cardTop = getElementOffset(card);
      const trigger = cardTop - stackPositionPx - itemStackDistance * index;
      if (scrollTop >= trigger) topCardIndex = index;
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const pinStart = cardTop - stackPositionPx - itemStackDistance * index;
      const pinEnd = endElementTop - containerHeight * 0.58;
      const scaleEnd = cardTop - scaleEndPositionPx;
      const progress = calculateProgress(scrollTop, pinStart, scaleEnd);
      const targetScale = Math.min(baseScale + index * itemScale, 1);
      const scale = 1 - progress * (1 - targetScale);
      const rotation = rotationAmount * index * progress;
      const blur = index < topCardIndex ? (topCardIndex - index) * blurAmount : 0;

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const next = {
        translateY: Math.round(translateY * 10) / 10,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 10) / 10,
        blur: Math.round(blur * 10) / 10,
      };
      const previous = lastTransformsRef.current.get(index);
      const changed =
        !previous ||
        Math.abs(previous.translateY - next.translateY) > 0.1 ||
        Math.abs(previous.scale - next.scale) > 0.001 ||
        Math.abs(previous.rotation - next.rotation) > 0.1 ||
        Math.abs(previous.blur - next.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${next.translateY}px, 0) scale(${next.scale}) rotate(${next.rotation}deg)`;
        card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : '';
        lastTransformsRef.current.set(index, next);
      }

      if (index === cardsRef.current.length - 1) {
        const complete = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (complete !== stackCompletedRef.current) {
          stackCompletedRef.current = complete;
          if (complete) onStackComplete?.();
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach((card, index) => {
      if (index < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.transformOrigin = 'top center';
      card.style.zIndex = String(index + 1);
    });

    if (reducedMotion) return undefined;

    const options = {
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    };

    if (!useWindowScroll) {
      options.wrapper = scroller;
      options.content = scroller.querySelector('.scroll-stack-inner');
    }

    let lenis = null;
    let nativeFallbackActive = false;
    const safeUpdate = () => {
      try {
        updateCardTransforms();
      } catch (error) {
        console.error('ScrollStack não conseguiu atualizar os cards:', error);
      }
    };
    const startNativeFallback = () => {
      if (nativeFallbackActive) return;
      nativeFallbackActive = true;
      window.addEventListener('scroll', safeUpdate, { passive: true });
      window.addEventListener('resize', safeUpdate);
    };

    /* Nunca entregue a rolagem da página inteira ao Lenis. O navegador mantém
       o limite correto mesmo quando imagens e seções posteriores mudam de altura. */
    if (useWindowScroll) {
      startNativeFallback();
      safeUpdate();

      return () => {
        window.removeEventListener('scroll', safeUpdate);
        window.removeEventListener('resize', safeUpdate);
        cardsRef.current = [];
        lastTransformsRef.current.clear();
        stackCompletedRef.current = false;
        isUpdatingRef.current = false;
      };
    }

    try {
      lenis = new Lenis(options);
      lenis.on('scroll', safeUpdate);
      lenisRef.current = lenis;

      const frame = (time) => {
        try {
          lenis?.raf(time);
          safeUpdate();
          animationFrameRef.current = requestAnimationFrame(frame);
        } catch (error) {
          console.error('Lenis indisponível; usando rolagem nativa:', error);
          lenis?.destroy();
          lenis = null;
          lenisRef.current = null;
          startNativeFallback();
        }
      };

      animationFrameRef.current = requestAnimationFrame(frame);
    } catch (error) {
      console.error('Lenis indisponível; usando rolagem nativa:', error);
      startNativeFallback();
    }

    safeUpdate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (nativeFallbackActive) {
        window.removeEventListener('scroll', safeUpdate);
        window.removeEventListener('resize', safeUpdate);
      }
      lenis?.destroy();
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      stackCompletedRef.current = false;
      isUpdatingRef.current = false;
    };
  }, [itemDistance, updateCardTransforms, useWindowScroll]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'is-window-scroll' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true" />
      </div>
    </div>
  );
}
