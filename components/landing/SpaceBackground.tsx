'use client'

import { useEffect, useRef } from 'react'

export function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = []
        const numStars = 200

        const shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; life: number }[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const initStars = () => {
            stars.length = 0
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    vx: Math.floor(Math.random() * 50) - 25,
                    vy: Math.floor(Math.random() * 50) - 25,
                    alpha: Math.random() * 0.5 + 0.1
                })
            }
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(2, 2, 5, 0.4)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const gradient1 = ctx.createRadialGradient(
                canvas.width * 0.2, canvas.height * 0.3, 0,
                canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4
            )
            gradient1.addColorStop(0, 'rgba(67, 20, 150, 0.08)')
            gradient1.addColorStop(1, 'rgba(2, 2, 5, 0)')

            ctx.fillStyle = gradient1
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const gradient2 = ctx.createRadialGradient(
                canvas.width * 0.8, canvas.height * 0.8, 0,
                canvas.width * 0.8, canvas.height * 0.8, canvas.width * 0.5
            )
            gradient2.addColorStop(0, 'rgba(20, 100, 200, 0.06)')
            gradient2.addColorStop(1, 'rgba(2, 2, 5, 0)')

            ctx.fillStyle = gradient2
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            stars.forEach((star) => {
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
                ctx.fill()

                star.x += star.vx * 0.005
                star.y += star.vy * 0.005

                if (star.x < 0) star.x = canvas.width
                if (star.x > canvas.width) star.x = 0
                if (star.y < 0) star.y = canvas.height
                if (star.y > canvas.height) star.y = 0

                star.alpha += (Math.random() - 0.5) * 0.05
                if (star.alpha > 1) star.alpha = 1
                if (star.alpha < 0.1) star.alpha = 0.1
            })

            // Spawn a shooting star
            if (Math.random() < 0.05) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: 0,
                    length: Math.random() * 150 + 50,
                    speed: Math.random() * 15 + 15,
                    opacity: 1,
                    life: 0
                })
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i]

                ctx.save()
                ctx.beginPath()
                ctx.moveTo(ss.x, ss.y)
                ctx.lineTo(ss.x - ss.length, ss.y - ss.length)

                ctx.shadowBlur = 20
                ctx.shadowColor = '#ffffff'
                ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`
                ctx.lineCap = "round"
                ctx.lineWidth = 3
                ctx.stroke()
                ctx.restore()

                ss.x += ss.speed
                ss.y += ss.speed
                ss.life++

                if (ss.life > 20) {
                    ss.opacity -= 0.05
                }

                if (ss.opacity <= 0 || ss.x > canvas.width + 200 || ss.y > canvas.height + 200) {
                    shootingStars.splice(i, 1)
                }
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        resize()
        initStars()
        draw()

        window.addEventListener('resize', () => {
            resize()
            initStars()
        })

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none -z-10"
        />
    )
}
