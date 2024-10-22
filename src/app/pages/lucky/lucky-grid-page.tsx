"use client"

import React, {useState, useRef, useEffect} from 'react'
// @ts-ignore
import {LuckyGrid} from '@lucky-canvas/react'
import {queryRaffleAwardList, queryRaffleAwardListByGird, randomRaffle, randomRaffleByGrid} from "@/apis";
import {RaffleAwardVO} from "@/types/RaffleAwardVO";
import {number} from "prop-types";

/**
 * 大转盘文档：https://100px.net/docs/grid.html
 * @constructor
 */
export function LuckyGridPage() {
    // 背景
    const [blocks] = useState([
        {padding: '10px', background: '#869cfa'}
    ])
    const queryParams = new URLSearchParams(window.location.search);
    const strategyId = Number(queryParams.get('strategyId'));//通过地址拿到地址传入的strategyId的值

    //
    const [prizes, setPrizes] = useState<{
        x: number;
        y: number;
        fonts: { text: string; top: string }[];
    }[]>([]);

    const [buttons] = useState([
        {x: 1, y: 1, background: "#7f95d1", fonts: [{text: '开始', top: '35%'}]}
    ])

    const [defaultStyle] = useState([{background: "#b8c5f2"}])

    const queryRaffleAwardListHandle = async () => {
        const result = await queryRaffleAwardListByGird(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        };

        // 创建一个新的奖品数组


        const prizes = data.map((award: RaffleAwardVO, index: number) => {
            const x = index % 3;
            const y = Math.floor(index / 3);
            if (x === 1 && y === 1) {
                return null; // 跳过 x=1, y=1 的项
            }
            return {
                x,
                y,
                fonts: [{ text: award.awardTitle, top: '35%' }]
            };
        }).filter((item: null) => item !== null);
        // 设置奖品数据
        setPrizes(prizes)

    }
    const randomRaffleHandle = async () => {
        const result = await randomRaffleByGrid(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("随机抽奖失败 code:" + code + " info:" + info)
            return;
        }

        return data.awardIdex;
    }

    const myLucky = useRef()

    useEffect(() => {
        queryRaffleAwardListHandle().then(r => {
        });
    }, [])

    return <>
        <LuckyGrid
            ref={myLucky}
            width="300px"
            height="300px"
            rows="3"
            cols="3"
            prizes={prizes}
            defaultStyle={defaultStyle}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    randomRaffleHandle().then(prizeIndex => {
                        // @ts-ignore
                        myLucky.current.stop(prizeIndex)
                    })
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    //alert('恭喜你抽到 ' + prize.fonts.text + ' 号奖品')
                    // 添加更多的调试信息
                    console.log('onEnd callback triggered');
                    console.log('prize object:', prize);

                    // 读取 fonts 数组中的 text 属性
                    //const fontText = prize && prize.fonts && prize.fonts.length > 0 ? prize.fonts[0].text : '未知奖品';
                    // 使用 fontText 显示中奖信息
                    alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品');
                }
            }>

        </LuckyGrid>
    </>

}


// export function LuckyGridPage() {
//     // 背景
//     const [blocks] = useState([
//         {padding: '10px', background: '#869cfa'}
//     ])
//
//     const [prizes] = useState([
//         {x: 0, y: 0, fonts: [{text: 'A', top: '35%'}]},
//         {x: 1, y: 0, fonts: [{text: 'B', top: '35%'}]},
//         {x: 2, y: 0, fonts: [{text: 'C', top: '35%'}]},
//         {x: 2, y: 1, fonts: [{text: 'D', top: '35%'}]},
//         {x: 2, y: 2, fonts: [{text: 'E', top: '35%'}]},
//         {x: 1, y: 2, fonts: [{text: 'F', top: '35%'}]},
//         {x: 0, y: 2, fonts: [{text: 'G', top: '35%'}]},
//         {x: 0, y: 1, fonts: [{text: 'H', top: '35%'}]},
//     ])
//
//     const [buttons] = useState([
//         {x: 1, y: 1, background: "#7f95d1", fonts: [{text: '开始', top: '35%'}]}
//     ])
//
//     const [defaultStyle] = useState([{background: "#b8c5f2"}])
//
//     const myLucky = useRef()
//
//     return <>
//         <LuckyGrid
//             ref={myLucky}
//             width="300px"
//             height="300px"
//             rows="3"
//             cols="3"
//             prizes={prizes}
//             defaultStyle={defaultStyle}
//             buttons={buttons}
//             onStart={() => { // 点击抽奖按钮会触发star回调
//                 // @ts-ignore
//                 myLucky.current.play()
//                 setTimeout(() => {
//                     const index = Math.random() * 8 >> 0
//                     // @ts-ignore
//                     myLucky.current.stop(index)
//                 }, 2500)
//             }}
//             onEnd={
//                 // @ts-ignore
//                 prize => {
//                     alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
//                 }
//             }>
//
//         </LuckyGrid>
//     </>
//
// }
