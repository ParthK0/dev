"use client";

import { useEffect, useRef } from "react";

export function useGravity() {
  const sequence = useRef("");
  const secret = "gravity";

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      sequence.current += e.key.toLowerCase();
      
      // Keep only the last N characters
      if (sequence.current.length > secret.length) {
        sequence.current = sequence.current.slice(-secret.length);
      }

      if (sequence.current === secret) {
        console.log("GRAVITY ENGAGED!");
        activateGravity();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activateGravity = async () => {
    // Dynamically import matter-js so it doesn't bloat the bundle
    const Matter = (await import("matter-js")).default;
    const { Engine, Render, Runner, World, Bodies, Body } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    // Create a renderer that sits on top
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Ground
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
    World.add(world, ground);

    // Find all cards and inputs
    const elements = document.querySelectorAll(".bg-card, button, input, .motion-tr");
    
    const bodyMap: { element: HTMLElement, body: Matter.Body, originalTransition: string }[] = [];

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      
      // Ignore tiny or hidden elements
      if (rect.width === 0 || rect.height === 0 || htmlEl.tagName === "BODY" || htmlEl.tagName === "HTML") return;

      const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.5, // Bouncy
          friction: 0.1,
          render: { visible: false } // We render the HTML elements ourselves
        }
      );

      World.add(world, body);
      
      // Save original styles
      const originalTransition = htmlEl.style.transition;
      htmlEl.style.transition = "none";
      htmlEl.style.position = "fixed";
      htmlEl.style.margin = "0";
      htmlEl.style.zIndex = "9999";
      htmlEl.style.width = `${rect.width}px`;
      htmlEl.style.height = `${rect.height}px`;

      bodyMap.push({ element: htmlEl, body, originalTransition });
    });

    // Sync HTML elements to physics bodies
    const updateLoop = () => {
      bodyMap.forEach(({ element, body }) => {
        element.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x/2}px`;
        element.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y/2}px`;
        // Transform origin center
        element.style.transformOrigin = "center center";
        // Actually, just apply transform:
        element.style.transform = `translate(${body.position.x - element.offsetWidth/2}px, ${body.position.y - element.offsetHeight/2}px) rotate(${body.angle}rad)`;
        
        // Remove fixed left/top to use transform solely for better performance
        element.style.left = "0px";
        element.style.top = "0px";
      });
      requestAnimationFrame(updateLoop);
    };

    requestAnimationFrame(updateLoop);
    
    // Make sure the canvas is behind the UI
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.style.position = "fixed";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9998";
    }
  };
}
