import React, { useState, useEffect, useRef } from 'react';
import { Flame, Check, Copy } from 'lucide-react';

export default function PromoAdBanner() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [isHoveredState, setIsHoveredState] = useState(false);

  // Keep references for animation loop without triggering react re-renders
  const isHovered = useRef(false);
  const angle = useRef(0);
  const speed = useRef(0.015);
  const targetSpeed = useRef(0.015);

  const centerX = useRef(0);
  const centerY = useRef(0);
  const rx = useRef(140);
  const ry = useRef(40);
  const targetRx = useRef(140);
  const targetRy = useRef(40);

  const segmentsRef = useRef([]);
  const particles = useRef([]);

  useEffect(() => {
    isHovered.current = isHoveredState;
    targetSpeed.current = isHoveredState ? 0.032 : 0.012;
  }, [isHoveredState]);

  // Copy coupon box handler
  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('AURA40');
    setCopiedCode(true);
    setTimeout(() => {
      setCopiedCode(false);
    }, 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;

      // Reset centers immediately on resize
      const btn = buttonRef.current;
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        centerX.current = btnRect.left - rect.left + btnRect.width / 2;
        centerY.current = btnRect.top - rect.top + btnRect.height / 2;
        rx.current = btnRect.width / 2 + 48;
        ry.current = btnRect.height / 2 + 32;
      }
    };

    // Initialize Dragon segments (30 links tapering, MUCH BIGGER sizes!)
    const segmentCount = 30;
    const segments = [];
    for (let i = 0; i < segmentCount; i++) {
      let color;
      if (i < 6) color = '#06b6d4'; // Cyan head
      else if (i < 13) color = '#3b82f6'; // Electric Blue
      else if (i < 20) color = '#a855f7'; // Purple
      else color = '#f97316'; // Orange tail

      segments.push({
        x: 0,
        y: 0,
        renderX: 0,
        renderY: 0,
        radius: Math.max(4.5, 17.5 * (1 - i / segmentCount)),
        color
      });
    }
    segmentsRef.current = segments;

    // Run resize first
    handleResize();
    window.addEventListener('resize', handleResize);

    // Set initial position of dragon
    if (segments.length > 0) {
      const hx = centerX.current + Math.cos(angle.current) * rx.current;
      const hy = centerY.current + Math.sin(angle.current) * ry.current;
      segments.forEach(seg => {
        seg.x = hx;
        seg.y = hy;
      });
    }

    let animationFrameId;

    // Rendering frame loop
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Semi-transparent overlay to clear canvas, creating light trails
      ctx.fillStyle = 'rgba(9, 14, 36, 0.16)';
      ctx.fillRect(0, 0, w, h);

      // Track button coordinates dynamically
      const btn = buttonRef.current;
      const parent = containerRef.current;
      if (btn && parent) {
        const btnRect = btn.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        const targetCenterX = btnRect.left - parentRect.left + btnRect.width / 2;
        const targetCenterY = btnRect.top - parentRect.top + btnRect.height / 2;

        centerX.current += (targetCenterX - centerX.current) * 0.1;
        centerY.current += (targetCenterY - centerY.current) * 0.1;

        targetRx.current = btnRect.width / 2 + 48;
        targetRy.current = btnRect.height / 2 + 32;

        rx.current += (targetRx.current - rx.current) * 0.1;
        ry.current += (targetRy.current - ry.current) * 0.1;
      }

      // Speed interpolation
      speed.current += (targetSpeed.current - speed.current) * 0.08;
      angle.current -= speed.current; // anti-clockwise orbit

      // Slither breathing float wave
      const time = Date.now() * 0.002;
      const hOscX = Math.sin(time) * 8;
      const hOscY = Math.cos(time) * 4;

      const headX = centerX.current + Math.cos(angle.current) * (rx.current + hOscX);
      const headY = centerY.current + Math.sin(angle.current) * (ry.current + hOscY);

      const segs = segmentsRef.current;
      if (segs.length > 0) {
        segs[0].x = headX;
        segs[0].y = headY;
        segs[0].renderX = headX;
        segs[0].renderY = headY;

        // Kinematic segment follower
        for (let i = 1; i < segs.length; i++) {
          const curr = segs[i];
          const prev = segs[i - 1];
          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const gap = 6.5; // distance between nodes

          if (dist > gap) {
            curr.x += dx * 0.55;
            curr.y += dy * 0.55;
          }

          // Perpendicular slither waves
          const angleMove = Math.atan2(dy, dx);
          const waveFreq = 0.42;
          const waveSpeed = 9;
          const waveAmp = isHovered.current ? 4.5 : 2.5;
          const offset = Math.sin(i * waveFreq - angle.current * waveSpeed) * waveAmp;

          curr.renderX = curr.x + Math.cos(angleMove + Math.PI / 2) * offset;
          curr.renderY = curr.y + Math.sin(angleMove + Math.PI / 2) * offset;
        }
      }

      // Spark generation
      if (Math.random() < (isHovered.current ? 0.95 : 0.4)) {
        const index = Math.floor(Math.random() * segs.length);
        const source = segs[index];
        particles.current.push({
          x: source.renderX,
          y: source.renderY,
          vx: (Math.random() - 0.5) * (isHovered.current ? 5.5 : 2.2),
          vy: (Math.random() - 0.5) * (isHovered.current ? 5.5 : 2.2),
          size: 0.8 + Math.random() * 1.8,
          color: source.color,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02
        });
      }

      // Update & Draw sparks
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // Draw spine tube connection (much thicker!)
      ctx.save();
      ctx.beginPath();
      if (segs.length > 0) {
        ctx.moveTo(segs[0].renderX, segs[0].renderY);
        for (let i = 1; i < segs.length; i++) {
          ctx.lineTo(segs[i].renderX, segs[i].renderY);
        }
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = isHovered.current ? 16 : 10.5;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.stroke();
      ctx.restore();

      // Draw segment beads
      for (let i = segs.length - 1; i >= 0; i--) {
        const seg = segs[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(seg.renderX, seg.renderY, seg.radius * (isHovered.current ? 1.2 : 1.0), 0, Math.PI * 2);
        
        ctx.shadowBlur = i === 0 ? (isHovered.current ? 25 : 18) : (isHovered.current ? 14 : 9);
        ctx.shadowColor = seg.color;
        ctx.fillStyle = seg.color;
        ctx.fill();

        // White core on head
        if (i === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(seg.renderX, seg.renderY, seg.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="cyberpunk-banner-wrap" ref={containerRef}>
      {/* Cyber Grid */}
      <div className="cyberpunk-grid-bg" />

      {/* Cyber Backdrop Blur Overlay */}
      <div className="cyberpunk-backdrop" />

      {/* Canvas Element */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 3
        }} 
      />

      <div className="cyberpunk-banner-glass">
        {/* Banner Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 3 }}>
          <div className="cyberpunk-badge-frame">
            <Flame size={13} style={{ animation: 'bounce 0.8s infinite alternate' }} />
            Accessories Bundle
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 className="cyberpunk-title">Aura Accessories – Save up to 40%!</h4>
            <p className="cyberpunk-desc">Upgrade your tech workspace with premium chargers, braided cables, and expansion hubs.</p>
          </div>
        </div>

        {/* Copy Coupon Box */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 10 }}>
          <div 
            ref={buttonRef}
            className="cyberpunk-code-box"
            onClick={handleCopyCode}
            onMouseEnter={() => setIsHoveredState(true)}
            onMouseLeave={() => setIsHoveredState(false)}
          >
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Code:</span>
            <span className="cyberpunk-code-text">AURA40</span>
            {copiedCode ? (
              <Check size={16} style={{ color: '#22c55e', animation: 'scaleUp 0.25s ease-out' }} />
            ) : (
              <Copy size={16} style={{ color: '#06b6d4' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
