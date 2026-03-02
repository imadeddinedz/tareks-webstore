'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
    once?: boolean;
}

export function Reveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    distance = 40,
    duration = 700,
    once = true,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once]);

    const transforms: Record<string, string> = {
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`,
        left: `translateX(${distance}px)`,
        right: `translateX(-${distance}px)`,
        none: 'none',
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : transforms[direction],
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}

// Stagger children with auto-delays
interface StaggerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
}

export function Stagger({
    children,
    className = '',
    staggerDelay = 80,
    direction = 'up',
    distance = 30,
    duration = 600,
}: StaggerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const transforms: Record<string, string> = {
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`,
        left: `translateX(${distance}px)`,
        right: `translateX(-${distance}px)`,
        none: 'none',
    };

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children)
                ? children.map((child, i) => (
                    <div
                        key={i}
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'none' : transforms[direction],
                            transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}ms`,
                            willChange: 'opacity, transform',
                        }}
                    >
                        {child}
                    </div>
                ))
                : children}
        </div>
    );
}

// Animated counter
interface CounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

export function Counter({ target, suffix = '', prefix = '', duration = 2000, className = '' }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [started, target, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count}{suffix}
        </span>
    );
}

// Magnetic hover effect
interface MagneticProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export function Magnetic({ children, className = '', strength = 0.3 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { if (el) el.style.transition = ''; }, 400);
    };

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ willChange: 'transform' }}
        >
            {children}
        </div>
    );
}
