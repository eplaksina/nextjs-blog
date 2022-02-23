import utilStyles from '../../styles/utils.module.scss'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(Draggable)

export default function Slider({children}) {
    const sliderItem = useRef();

    useEffect (() => {
        Draggable.create(sliderItem.current, {
            autoScroll:1,
            edgeResistance:0.65,
            type:"x",
        })
    })
    

    return (
        <div className={utilStyles.dragg_wrapper} style="max-width: 1080px;" ref={sliderItem}>
            {children}
        </div>
    )
}