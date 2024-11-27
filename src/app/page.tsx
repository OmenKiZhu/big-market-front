"use client";

import { useState, useEffect, useRef } from 'react';
import { LuckyWheelPage } from "@/app/pages/lucky/lucky-wheel-page";
import { LuckyGridPage } from "@/app/pages/lucky/lucky-grid-page";
import dynamic from "next/dynamic";
import './SnowEffect/music/music.css'



const StrategyArmoryButton = dynamic(async () => (await import("./components/StrategyArmory")).StrategyArmory);
const ActivityAccountButton = dynamic(async () => (await import("./components/ActivityAccount")).ActivityAccount);
const CalendarSignButton = dynamic(async () => (await import("./components/CalendarSign")).CalendarSign);
const StrategyRuleWeightButton = dynamic(async () => (await import("./components/StrategyRuleWeight")).StrategyRuleWeight);

export default function Home() {
    const [refresh, setRefresh] = useState(0);
    const snowContainerRef = useRef<HTMLDivElement>(null);
    const [snowflakes, setSnowflakes] = useState([]); // 声明状态变量和更新函数
    const [isPlaying, setIsPlaying] = useState(false); // 控制音乐播放状态
    const handleRefresh = () => {
        setRefresh(refresh + 1);
    };

    // 设置每秒生成雪花的数量
    const flakesPerSecond = 10; // 每秒生成30个雪花
    const intervalTime = 1000 / flakesPerSecond; // 计算生成间隔（毫秒）

    // 使用 useLayoutEffect 确保在浏览器绘制前执行
    useEffect(() => {
        const createSnowflake = () => {
            if (!snowContainerRef.current) return;

            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');

            // 设置随机位置
            const x = Math.random() * snowContainerRef.current.clientWidth;
            const y = -Math.random() * 100; // 从顶部不同高度开始
            snowflake.style.left = `${x}px`;
            snowflake.style.top = `${y}px`;

            // 设置随机大小
            const size = Math.random() * 10 + 10; // 10-20px
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;

            // 设置随机速度
            const duration = Math.random() * 7 + 3; // 3-10秒
            snowflake.style.animationDuration = `${duration}s, 2s`; // 下落时间和渐隐时间
            snowflake.style.animationDelay = `0s, ${duration - 2}s`; // 渐隐动画延迟

            // 添加到容器中
            snowContainerRef.current.appendChild(snowflake);

            // 更新状态以跟踪当前的雪花
            setSnowflakes(prevFlakes => [...prevFlakes, snowflake]);
        };

        // 每隔一段时间生成新的雪花
        const intervalId = setInterval(createSnowflake, intervalTime); // 生成间隔

        // 清理函数
        return () => clearInterval(intervalId);
    }, [intervalTime]);


    // 清除旧的雪花
    useEffect(() => {
        const removeOldSnowflakes = () => {
            if (snowflakes.length > 100) { // 限制同时存在的雪花数量
                const oldestSnowflake = snowflakes[0];
                if (oldestSnowflake && snowContainerRef.current) {
                    snowContainerRef.current.removeChild(oldestSnowflake);
                    setSnowflakes(prevFlakes => prevFlakes.slice(1));
                }
            }
        };

        // 设置一个定时器来移除旧的雪花
        const cleanupIntervalId = setInterval(removeOldSnowflakes, 1000 / 30); // 每秒检查一次

        // 清理函数
        return () => clearInterval(cleanupIntervalId);
    }, [snowflakes]);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                console.log("music is playing");
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Error attempting to play", error);
                });
                setIsPlaying(true);
            }
        }
    };

    useEffect(() => {
        // 确保音频元素在组件挂载时被正确引用
        if (audioRef.current) {
            console.log('Audio element is ready:', audioRef.current);
        }
    }, []);



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#e7305e]"
             style={{backgroundImage: "url('/background.svg')"}}
        >

            {/* 音乐播放控件 */}
            <div className="absolute right-4 top-4">
                <button
                    onClick={handlePlayPause}
                    className={`play-pause-button ${isPlaying ? 'bg-blue-500' : 'bg-white'}`}
                >
                    {isPlaying ? 'Pause' : 'Play'} Music
                </button>
            </div>

            {/* 音频元素 */}
            <audio
                ref={audioRef}
                src="/SantaTellMe.mp3"
                autoPlay
                loop
                //muted
                style={{ display: 'none' }}
            />


            {/* 头部文案 */}
            <div ref={snowContainerRef} className="snow-container relative" style={{width: '50%'}}>
                <header className="text-5xl font-bold text-center my-8" style={{
                    background: "linear-gradient(90deg, #ffcccc, #ffe5cc, #ffffff, #ccffcc, #ccffff, #ccccff, #ffccff)",
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textFillColor: 'transparent'
                }}>
                    OmenKi - Raffle - BigMarket
                </header>
            </div>

            <div className="flex items-center space-x-4">
                {/* 装配抽奖 */}
                <StrategyArmoryButton/>

                {/* 账户额度 */}
                <ActivityAccountButton refresh={refresh}/>

                {/* 日历签到 */}
                <CalendarSignButton handleRefresh={handleRefresh}/>
            </div>

            {/* 中间的两个div元素 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyWheelPage/>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyGridPage handleRefresh={handleRefresh}/>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <StrategyRuleWeightButton refresh={refresh}/>
            </div>

            {/* 底部文案 */}
            <footer className="text-gray-600 text-center my-8" style={{color: "white"}}>
                OmenKi-SWJTU-LAB-2409 ||<a href='https://github.com/OmenKiZhu/big-market-front' target='_blank'
                                           style={{color: "#0092ff"}}> My Github
                ||</a> @OmenKi
            </footer>
        </div>
    );
}