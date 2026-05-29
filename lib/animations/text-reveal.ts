import SplitType from "split-type";
import { gsap } from "gsap";

export function createTextReveal(
  element: HTMLElement,
  options?: {
    type?: "chars" | "words" | "lines";
    delay?: number;
    duration?: number;
    stagger?: number;
  }
) {
  const type = options?.type || "words";
  const delay = options?.delay || 0;
  const duration = options?.duration || 0.7;
  const stagger = options?.stagger ?? (type === "chars" ? 0.02 : 0.05);

  // Split text
  const split = new SplitType(element, { types: type });
  const targets = split[type];

  if (!targets) return { play: () => {}, revert: () => {}, scrollTrigger: () => undefined };

  // Set initial state (displace downwards and hide)
  gsap.set(targets, { y: "110%", opacity: 0 });

  // Disable CSS transitions on dynamic nodes to prevent rendering conflicts with GSAP loop
  gsap.set(targets, { transition: "none" });

  const activeAnims: gsap.core.Tween[] = [];

  const anim = gsap.to(targets, {
    y: "0%",
    opacity: 1,
    duration: duration,
    delay: delay,
    stagger: stagger,
    ease: "power3.out",
    paused: true,
  });
  activeAnims.push(anim);

  return {
    play: () => anim.play(),
    revert: () => {
      activeAnims.forEach((a) => {
        a.kill();
        if (a.scrollTrigger) {
          a.scrollTrigger.kill();
        }
      });
      split.revert();
    },
    scrollTrigger: (trigger: HTMLElement) => {
      const scrollAnim = gsap.to(targets, {
        y: "0%",
        opacity: 1,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: trigger,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      activeAnims.push(scrollAnim);
      return scrollAnim;
    },
  };
}

