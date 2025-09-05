"use client"

import { useEffect, useState } from "react"

function AnimatedText() {
  const [currentLetter, setCurrentLetter] = useState(0)
  const text = "D_donut"

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetter((prev) => (prev + 1) % text.length)
    }, 200)

    return () => clearInterval(interval)
  }, [text.length])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-2xl font-bold text-white">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-500 ${
              index === currentLetter ? "text-coral-400 scale-110 drop-shadow-lg" : "text-white"
            }`}
            style={{
              textShadow:
                index === currentLetter
                  ? `
                  0 0 8px rgba(255, 107, 107, 0.8),
                  0 0 16px rgba(255, 107, 107, 0.6),
                  0 2px 4px rgba(0, 0, 0, 0.3)
                `
                  : `
                  0 0 4px rgba(255, 107, 107, 0.4),
                  0 2px 4px rgba(0, 0, 0, 0.3)
                `,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="flex gap-0">
        {text.split("").map((_, letterIndex) => (
          <div key={letterIndex} className="flex gap-1 justify-center" style={{ width: "1.2em" }}>
            {[0, 1].map((dotIndex) => (
              <div
                key={dotIndex}
                className={`w-1.5 h-1 rounded-full border transition-all duration-500 ${
                  letterIndex === currentLetter ? "animate-pulse" : ""
                }`}
                style={{
                  background: "transparent",
                  borderWidth: "1px",
                  borderColor: letterIndex === currentLetter ? "rgba(255, 107, 107, 1)" : "rgba(255, 107, 107, 0.4)",
                  boxShadow:
                    letterIndex === currentLetter
                      ? `
                      0 0 6px rgba(255, 107, 107, 0.8),
                      inset 0 0 2px rgba(255, 107, 107, 0.4)
                    `
                      : `
                      0 0 2px rgba(255, 107, 107, 0.3),
                      inset 0 0 1px rgba(255, 107, 107, 0.2)
                    `,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DonutLoader() {
  return (
    <div className="fixed inset-0 w-full h-full  flex items-center justify-center z-50">
      <AnimatedText />
    </div>
  )
}
