import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import cursor_styles from "./cursor.module.scss";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { gsap } from "gsap"


interface Props {
  children: JSX.Element;
  color?: string;
  hoverClasses?: hoverStyle[];
}

type CursorChildrenType = JSX.Element | string | undefined | number;

interface hoverStyle {
  classNameOfTargetElement: string;
  classNameOfStyle: string;
  cursorChildren?: CursorChildrenType;
}

export default function Cursor({
  children,
  color,
  hoverClasses = [],
}: Props) {

  const [classes, setClasses] = useState<
    {
      elements: NodeListOf<Element>;
      classNameOfTarget: string;
      className: string;
      cursorChildren: CursorChildrenType;
    }[]
  >([]);

  // get The cursor wrapper also cursorDotElement
  const cursorWrapperElement = useRef<HTMLDivElement>(null)
  const cursorDefaultElement = useRef<HTMLDivElement>();

  useEffect(() => {
    if (hoverClasses.length) {
      hoverClasses.forEach(hoverClass => {
        const elements = document.querySelectorAll(
          `.${hoverClass.classNameOfTargetElement}`
        );
        setClasses(current => {
          const cl = {
            elements,
            className: hoverClass.classNameOfStyle,
            cursorChildren: hoverClass.cursorChildren,
            classNameOfTarget: hoverClass.classNameOfTargetElement
          };
  
          return [...current, cl];
        });
      });
    }
  }, [hoverClasses])
  

  const mouseDownHandler = () => {
    if (cursorDefaultElement.current && cursorDefaultElement.current.classList)
      cursorDefaultElement.current.classList.add(cursor_styles.smaller_cursor)
  };


  const mouseUpHandler = () => {
    if (cursorDefaultElement.current && cursorDefaultElement.current.classList)
      cursorDefaultElement.current.classList.remove(cursor_styles.smaller_cursor);
  }

  const mouseOverHandler = useCallback(() => {
    if (classes.length) {
      classes.forEach(className => {
        for (let i = 0; i < className.elements.length; i++) {
          className.elements[i].addEventListener("mouseover", () => {
            cursorWrapperElement.current?.classList.add(className.className);
            
            if(className.classNameOfTarget == "video_preview") {
              gsap.set(cursorDefaultElement.current, {xPercent: 40, yPercent: 40}) 
/*               gsap.to(className.elements[i], {scale: 1.1, duration: 2}) 
 */
            } 

            

            if (className?.cursorChildren) {
              cursorDefaultElement.current?.classList.add(cursor_styles.transition_none);
              ReactDOM.render(
                className?.cursorChildren,
                cursorDefaultElement.current
              );
            }
          });
        }
      });
    }
  }, [classes, hoverClasses]);

  const mouseOutHandler = useCallback(() => {
    if (classes.length)
      classes.forEach(className => {
        for (let i = 0; i < className.elements.length; i++) {
          className.elements[i].addEventListener("mouseout", () => {
            
            cursorWrapperElement.current?.classList.remove(className.className);

            if (className.cursorChildren && cursorDefaultElement.current) {
              cursorDefaultElement.current?.classList.remove(cursor_styles.transition_none);
              ReactDOM.unmountComponentAtNode(cursorDefaultElement.current);
            }

            if(className.classNameOfTarget == "video_preview") {

              gsap.set(cursorDefaultElement.current, {xPercent: -50, yPercent: -50}) 
/*            gsap.to(className.elements[i], {scale: 1}) 
 */
            }
            
          });
        }
      });
  }, [classes, hoverClasses]);

  useEffect(() => {
  
    gsap.set(cursorDefaultElement.current, {xPercent:-50, yPercent:-50});

    window.addEventListener("mousemove", e => {
      gsap.to(cursorDefaultElement.current, {x: e.clientX, y: e.clientY, ease:"power3.out"})   
    });

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("mouseover", mouseOverHandler);
    window.addEventListener("mouseout", mouseOutHandler);

    return () => {
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("mouseover", mouseOverHandler);
      window.removeEventListener("mouseout", mouseOutHandler);
    };
  }, [classes, hoverClasses]);


  return (
    <div
      ref={cursorWrapperElement}
      className="cursor-wrapper"
      >
      <div
        ref={cursorDefaultElement}
        className={`${cursor_styles.cursor_default}`}>
        </div>
      {children}
    </div>
  );
}

Cursor.propTypes = {
  children: PropTypes.element.isRequired,
  hoverClasses: PropTypes.arrayOf(
    PropTypes.shape({
      classNameOfTargetElement: PropTypes.string.isRequired,
      classNameOfStyle: PropTypes.string.isRequired,
      cursorChildren: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ]),
    })
  ),
};

