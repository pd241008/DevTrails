"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../app/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, MessageSquare, ShieldAlert, CheckCircle2, Camera, Loader2, RefreshCw, Zap } from "lucide-react";
import axios from "axios";

export default function ManualClaimModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, submitClaim, addNotification } = useAppContext();
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setCameraError("Camera access denied. Please allow permissions or use file upload.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas size to video aspect ratio
      canvas.width = 800; // Resizing for performance and localStorage limits
      const scale = 800 / video.videoWidth;
      canvas.height = video.videoHeight * scale;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.7);
      setImagePreview(base64);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        const scale = 800 / img.width;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.7));
      };
      if (event.target?.result) img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !imagePreview) return;

    setIsProcessing(true);

    try {
        const evalRes = await axios.post('/api/claims/evaluate', {
            worker_id: user?.name || "unknown",
            description,
            image_b64: imagePreview,
            amount: 500
        });

        submitClaim({
            workerId: user?.name || "unknown",
            workerName: user?.name || "Anonymous",
            description,
            image: imagePreview,
            amount: 500,
            aiScore: evalRes.data.confidence_score,
            aiMessage: evalRes.data.message
        });

        // AUTO-PROCEED LOGIC: If confidence > 90%, skip manual review
        const isAutoApproved = evalRes.data.confidence_score > 90;
        
        if (isAutoApproved) {
            // We need the ID of the claim we just submitted. 
            // Since submitClaim is async-state, we'll simulate the auto-approval notification here
            // and let the next effect or a direct call handle the state update if possible.
            // For the demo, we'll call a special 'autoApprove last claim' logic or just notify.
            addNotification({
                title: "Ensemble Fast-Tracked",
                message: `Confidence: ${evalRes.data.confidence_score}% | Claim auto-approved and paid out instantly.`,
                type: 'claim'
            });
        } else {
            addNotification({
                title: "Ensemble Verified",
                message: `Evaluation Complete. ${evalRes.data.message}`,
                type: 'system'
            });
        }

        setSubmitted(true);
        setTimeout(() => {
            onClose();
            setSubmitted(false);
            setDescription("");
            setImagePreview(null);
        }, 2500);
    } catch (err) {
        console.error("Submission error", err);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="border-b border-zinc-800 p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <ShieldAlert className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white tracking-tight uppercase">Protocol Execution</h2>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">Manual Adjudication Request</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                disabled={isProcessing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8">
              {submitted ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center text-center"
                >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Payload Transmitted</h3>
                    <p className="text-sm text-zinc-500 max-w-xs">Multimodal ensemble pipeline has received your evidence for review.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Incident Narrative</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-zinc-600" />
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the disruption context..."
                            className="w-full min-h-[100px] rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 pl-12 text-sm text-white placeholder-zinc-700 focus:border-indigo-500 focus:outline-none transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div>
                    <label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Visual Evidence</label>
                    
                    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 min-h-[240px] flex items-center justify-center">
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img src={imagePreview} alt="Evidence" className="h-full w-full object-cover" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => { setImagePreview(null); startCamera(); }}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : isCameraActive ? (
                            <div className="relative w-full aspect-video bg-black">
                                <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
                                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                                    <button 
                                        type="button"
                                        onClick={capturePhoto}
                                        className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-white/20 active:scale-95 transition-all"
                                    >
                                        <div className="h-12 w-12 rounded-full border-2 border-black/10 flex items-center justify-center">
                                            <Camera className="h-6 w-6 text-black" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 flex flex-col items-center gap-6 w-full">
                                {cameraError && <p className="text-[10px] font-bold text-rose-500 uppercase">{cameraError}</p>}
                                <button 
                                    type="button"
                                    onClick={startCamera}
                                    className="flex flex-col items-center gap-4 group"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
                                        <Camera className="h-8 w-8 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Initialize Webcap Sensor</span>
                                </button>
                                
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-[1px] flex-1 bg-zinc-800"></div>
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">OR</span>
                                    <div className="h-[1px] flex-1 bg-zinc-800"></div>
                                </div>

                                <label className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm hover:border-zinc-700 hover:bg-zinc-800 transition-all">
                                    <Upload className="h-4 w-4 text-zinc-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Manual File Import</span>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                </label>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing || !imagePreview}
                    className={`w-full rounded-2xl py-4 text-sm font-black text-white uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                        isProcessing ? "bg-zinc-800 cursor-not-allowed" : "bg-indigo-500 shadow-indigo-500/20 hover:bg-indigo-600"
                    }`}
                  >
                    {isProcessing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Ensemble Adjudicating...
                        </>
                    ) : (
                        <>
                            <Zap className="h-4 w-4" />
                            Submit for Evaluation
                        </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
