"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { steps } from "./data";
import type { OnboardingStep } from "./data";
import "./OnboardingTour.css";

interface ImgRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Given an <img> element rendered with object-fit:contain,
 * returns the pixel rect of the actual image content relative
 * to the img element's own top-left corner.
 */
function getContainRect(img: HTMLImageElement): ImgRect {
  if (!img || !img.naturalWidth || !img.naturalHeight) {
    return {
      top: 0,
      left: 0,
      width: img ? img.offsetWidth : 0,
      height: img ? img.offsetHeight : 0,
    };
  }
  const cW = img.offsetWidth;
  const cH = img.offsetHeight;
  const iW = img.naturalWidth;
  const iH = img.naturalHeight;
  if (iW / iH > cW / cH) {
    const rH = (cW * iH) / iW;
    return { top: (cH - rH) / 2, left: 0, width: cW, height: rH };
  } else {
    const rW = (cH * iW) / iH;
    return { top: 0, left: (cW - rW) / 2, width: rW, height: cH };
  }
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: (completed: boolean) => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [displayImage, setDisplayImage] = useState(steps[0].image);
  const [imgRect, setImgRect] = useState<ImgRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const step: OnboardingStep = steps[currentStepIndex];

  const updateRect = useCallback(() => {
    if (imgRef.current) setImgRect(getContainRect(imgRef.current));
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Reset marker index when step changes */
  useEffect(() => {
    setActiveMarkerIndex(0);
  }, [currentStepIndex]);

  /* Image flicker + rect reset */
  useEffect(() => {
    setDisplayImage("");
    setImgRect({ top: 0, left: 0, width: 0, height: 0 });
    const t = setTimeout(() => setDisplayImage(step.image), 10);
    return () => clearTimeout(t);
  }, [step.image]);

  /* Re-measure on window resize */
  useEffect(() => {
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  const closeTour = useCallback(
    (completed: boolean = false) => {
      onClose(completed);
      setTimeout(() => {
        setCurrentStepIndex(0);
        setDirection(0);
        setActiveMarkerIndex(0);
      }, 500);
    },
    [onClose]
  );

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex((p) => p + 1);
    }
  }, [currentStepIndex]);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex((p) => p - 1);
      setActiveMarkerIndex(0);
    }
  };

  const handleMarkerClick = useCallback(() => {
    if (step.sequenceMarkers && step.markers && activeMarkerIndex < step.markers.length - 1) {
      setActiveMarkerIndex((p) => p + 1);
    } else {
      handleNext();
    }
  }, [step, activeMarkerIndex, handleNext]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }),
  };

  if (!isOpen) return null;

  return (
    <div id="tourOverlay">
      <div id="tourCard">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStepIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ width: "100%", height: "100%", display: "flex" }}
          >
            {/* ── Left: Content ── */}
            <div className="content-column">
              <div className="tourHeader">
                <span id="stepCount">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <h2 id="title">{step.title}</h2>
              </div>
              <p id="description">{step.description}</p>
              <div className="controls">
                <button
                  id="prevBtn"
                  className="tour-btn"
                  onClick={handlePrev}
                  style={{
                    visibility: currentStepIndex === 0 ? "hidden" : "visible",
                  }}
                >
                  Previous
                </button>
                {currentStepIndex === steps.length - 1 ? (
                  <button
                    id="nextBtn"
                    className="tour-btn"
                    onClick={() => closeTour(true)}
                  >
                    Finish
                  </button>
                ) : (
                  <button
                    id="skipBtn"
                    className="tour-btn"
                    onClick={() => closeTour(false)}
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>

            {/* ── Right: Image + Markers ── */}
            <div className="image-column">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  id="stepImage"
                  src={displayImage}
                  alt="Tour Step"
                  onLoad={updateRect}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                {/* Marker overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: imgRect.top,
                    left: imgRect.left,
                    width: imgRect.width,
                    height: imgRect.height,
                    overflow: "visible",
                  }}
                >
                  {step.sequenceMarkers && step.markers ? (
                    <>
                      <motion.div
                        className="marker active-seq-marker"
                        onClick={handleMarkerClick}
                        animate={{
                          top: `${step.markers[activeMarkerIndex].top}%`,
                          left: `${step.markers[activeMarkerIndex].left}%`,
                          width: `${step.markers[activeMarkerIndex].width}%`,
                          height: `${step.markers[activeMarkerIndex].height}%`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        style={{ cursor: "pointer", zIndex: 10 }}
                      />
                      {step.arrowAnnotations &&
                        (() => {
                          const ann = step.arrowAnnotations[activeMarkerIndex];
                          const isUp = ann?.direction === "up";
                          return (
                            <motion.div
                              className="arrow-annotation"
                              onClick={handleMarkerClick}
                              animate={{
                                top: `${ann.top}%`,
                                left: `${ann.left}%`,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                              style={{
                                position: "absolute",
                                transform: "translateX(-50%)",
                                display: "flex",
                                flexDirection: isUp
                                  ? "column-reverse"
                                  : "column",
                                alignItems: "center",
                                cursor: "pointer",
                                zIndex: 20,
                              }}
                            >
                              <span className="arrow-caption">
                                {ann.caption}
                              </span>
                              <svg
                                className="arrow-svg"
                                viewBox="0 0 24 32"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  transform: isUp ? "scaleY(-1)" : "none",
                                }}
                              >
                                <path
                                  d="M12 0 L12 22 M5 15 L12 24 L19 15"
                                  stroke="#facc15"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                            </motion.div>
                          );
                        })()}
                    </>
                  ) : step.markers ? (
                    <>
                      {step.markers.map((m, i) => {
                        const clickable = step.clickableMarkerIndex === i;
                        return (
                          <div
                            key={i}
                            className="marker"
                            onClick={
                              clickable ? handleNext : undefined
                            }
                            style={{
                              top: `${m.top}%`,
                              left: `${m.left}%`,
                              width: `${m.width}%`,
                              height: `${m.height}%`,
                              cursor: clickable ? "pointer" : "default",
                            }}
                          />
                        );
                      })}
                      {step.arrowAnnotations &&
                        step.arrowAnnotations.map((ann, i) => {
                          const isUp = ann.direction === "up";
                          const clickable = step.clickableMarkerIndex === i;
                          return (
                            <div
                              key={`ann-${i}`}
                              className="arrow-annotation"
                              onClick={
                                clickable ? handleNext : undefined
                              }
                              style={{
                                position: "absolute",
                                top: `${ann.top}%`,
                                left: `${ann.left}%`,
                                transform: "translateX(-50%)",
                                display: "flex",
                                flexDirection: isUp
                                  ? "column-reverse"
                                  : "column",
                                alignItems: "center",
                                cursor: clickable ? "pointer" : "default",
                                pointerEvents: clickable ? "auto" : "none",
                                zIndex: 20,
                              }}
                            >
                              <span className="arrow-caption">
                                {ann.caption}
                              </span>
                              <svg
                                className="arrow-svg"
                                viewBox="0 0 24 32"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  transform: isUp ? "scaleY(-1)" : "none",
                                }}
                              >
                                <path
                                  d="M12 0 L12 22 M5 15 L12 24 L19 15"
                                  stroke="#facc15"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    step.marker && (
                      <div
                        id="marker"
                        onClick={
                          step.clickable || currentStepIndex === 0
                            ? handleNext
                            : undefined
                        }
                        style={{
                          top: `${step.marker.top}%`,
                          left: `${step.marker.left}%`,
                          width: `${step.marker.width}%`,
                          height: `${step.marker.height}%`,
                          cursor:
                            step.clickable || currentStepIndex === 0
                              ? "pointer"
                              : "default",
                        }}
                      />
                    )
                  )}

                  {/* ── Arrow + Caption annotation (step-level) ── */}
                  {step.arrowAnnotation &&
                    (() => {
                      const ann = step.arrowAnnotation;
                      const isUp = ann.direction === "up";
                      return (
                        <div
                          className="arrow-annotation"
                          style={{
                            position: "absolute",
                            top: `${ann.top}%`,
                            left: `${ann.left}%`,
                            transform: "translateX(-50%)",
                            display: "flex",
                            flexDirection: isUp ? "column-reverse" : "column",
                            alignItems: "center",
                            pointerEvents: "none",
                            zIndex: 20,
                          }}
                        >
                          <span className="arrow-caption">{ann.caption}</span>
                          <svg
                            className="arrow-svg"
                            viewBox="0 0 24 32"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              transform: isUp ? "scaleY(-1)" : "none",
                            }}
                          >
                            <path
                              d="M12 0 L12 22 M5 15 L12 24 L19 15"
                              stroke="#facc15"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </div>
                      );
                    })()}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingTour;
