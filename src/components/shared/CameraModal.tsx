"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Camera, SwitchCamera, AlertTriangle } from "lucide-react";

interface CameraModalProps {
  onCapture: (dataUrl: string, file: File) => void;
  onClose: () => void;
}

export function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async (mode: "environment" | "user") => {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setReady(false);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setReady(true);
        };
      }
    } catch (err) {
      const e = err as Error;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setError("Camera access was denied. Please allow camera permission in your browser settings.");
      } else if (e.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Could not access the camera. Please try uploading an image instead.");
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFlip() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // Convert to File object
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      // Stop stream before notifying parent
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onCapture(dataUrl, file);
    }, "image/jpeg", 0.92);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          color: "white",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16 }}>Take a Photo</span>
        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onClose();
          }}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
          }}
          aria-label="Close camera"
        >
          <X size={20} />
        </button>
      </div>

      {/* Viewfinder */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          aspectRatio: "4/3",
          background: "#111",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: error ? "none" : "block",
            transform: facingMode === "user" ? "scaleX(-1)" : "none",
          }}
        />

        {/* Corner guides */}
        {ready && !error && (
          <>
            {[
              { top: 16, left: 16, borderWidth: "3px 0 0 3px" },
              { top: 16, right: 16, borderWidth: "3px 3px 0 0" },
              { bottom: 16, left: 16, borderWidth: "0 0 3px 3px" },
              { bottom: 16, right: 16, borderWidth: "0 3px 3px 0" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 28,
                  height: 28,
                  borderColor: "var(--color-primary, #4f46e5)",
                  borderStyle: "solid",
                  borderRadius: 2,
                  ...s,
                }}
              />
            ))}
          </>
        )}

        {/* Loading overlay */}
        {!ready && !error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 14,
            }}
          >
            Starting camera…
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              gap: 12,
              color: "white",
              textAlign: "center",
            }}
          >
            <AlertTriangle size={40} style={{ color: "#f59e0b" }} />
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>{error}</p>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Controls */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "20px 16px",
        }}
      >
        {/* Flip camera */}
        <button
          onClick={handleFlip}
          disabled={!!error}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: error ? "not-allowed" : "pointer",
            color: "white",
            opacity: error ? 0.4 : 1,
          }}
          aria-label="Flip camera"
        >
          <SwitchCamera size={22} />
        </button>

        {/* Shutter button */}
        <button
          onClick={handleCapture}
          disabled={!ready || !!error}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: ready && !error ? "white" : "rgba(255,255,255,0.3)",
            border: "4px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: ready && !error ? "pointer" : "not-allowed",
            transition: "transform 0.1s",
            boxShadow: "0 0 0 4px rgba(255,255,255,0.2)",
          }}
          aria-label="Capture photo"
          onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.92)"); }}
          onMouseUp={(e) => { (e.currentTarget.style.transform = "scale(1)"); }}
        >
          <Camera size={28} style={{ color: "#1e1b4b" }} />
        </button>

        {/* Spacer to balance layout */}
        <div style={{ width: 48 }} />
      </div>
    </div>
  );
}
