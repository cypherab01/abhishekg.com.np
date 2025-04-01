"use client";

import { Button } from "@/components/ui/button";
import { setLoveCountServerAction } from "../actions/getAndSetLoveCountServerAction";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const LoveButtonComponent = () => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already liked in this session
    const liked = sessionStorage.getItem("hasLiked");
    if (liked === "true") {
      setHasLiked(true);
    }
  }, []);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const result = await setLoveCountServerAction();
      if (result.success) {
        setHasLiked(true);
        sessionStorage.setItem("hasLiked", "true");
        // Update the count display
        const countElement = document.getElementById("love-count");
        if (countElement) {
          countElement.textContent = result.count.toString();
        }
      }
    } catch (error) {
      console.error("Failed to update love count:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <Button
      variant={hasLiked ? "secondary" : "default"}
      size="lg"
      className={cn(
        "mt-4 px-6 py-3 cursor-pointer rounded-full transition-all duration-300 flex items-center gap-2 font-medium",
        hasLiked
          ? "bg-primary/10 text-muted-foreground hover:bg-primary/15 border border-primary/20"
          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        isAnimating && "scale-105",
        "relative overflow-hidden"
      )}
      id="love-button"
      onClick={handleLike}
      disabled={hasLiked || isLoading}
    >
      <span
        className={cn(
          "absolute inset-0 bg-primary/10 opacity-0",
          isAnimating && !hasLiked && "animate-pulse opacity-30"
        )}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={hasLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "size-5 transition-transform duration-300",
          isAnimating && hasLiked && "animate-ping",
          hasLiked && "text-rose-500"
        )}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>

      <span
        className={cn(
          "transition-opacity duration-300 font-semibold",
          isLoading && "opacity-70"
        )}
      >
        {hasLiked ? "Thank you, much appreciated!" : "Love this portfolio"}
      </span>

      {isLoading && !hasLiked && (
        <span className="ml-1 inline-block animate-spin">⋯</span>
      )}
    </Button>
  );
};

export default LoveButtonComponent;
