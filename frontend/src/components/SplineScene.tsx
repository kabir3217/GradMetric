"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>,
});

export default function SplineScene() {
  const [error, setError] = useState(false);

  return (
    <div className="w-full h-[600px] bg-gray-200 rounded-xl overflow-hidden">
      {!error ? (
        <Spline
          scene="https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode"
          onError={() => {
            console.error("Spline failed to load");
            setError(true);
          }}
        />
      ) : (
        <div className="text-center py-20 text-red-600">
          ❌ Failed to load 3D scene — buffer issue!
        </div>
      )}
    </div>
  );
}
