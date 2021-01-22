import React, { useEffect, useState } from "react";

import './index.css';

import { hookHeight } from "./utils";

// Default delay for animation for smooth experience
const DEFAULT_ANIMATION_DELAY: number = 250;

interface BottomSheetProps {
  children: any;
  isExpandable: boolean;
  onClose?: any;
  customHeight?: number | undefined;
  backdropClassName?: string | undefined;
  backdropStyle?: any;
  containerClassName?: string | undefined;
  containerStyle?: any;
  animationDelay?: number;
  // isFullscreen,
}

interface BottomSheetViewProps {
  children: any;
  bottom: number;
  isExpandable: boolean;
  onClose: any;
  onTouchStart: any;
  onTouchEnd: any;
  onMove: any;
  onScroll: any;
  backdropClassName?: string | undefined;
  backdropStyle?: any;
  containerClassName?: string | undefined;
  containerStyle?: any;
  customHeight?: number | undefined;
  animationName: string;
  isFullscreen: boolean;
  closeBottomSheet: any;
}

const BottomSheetView = (props: BottomSheetViewProps) => {
  const {
    bottom,
    children,
    isExpandable,
    customHeight,
    onTouchStart,
    onMove,
    onTouchEnd,
    onScroll,
    backdropClassName,
    backdropStyle,
    containerClassName,
    containerStyle,
    isFullscreen,
    animationName,
    closeBottomSheet,
  } = props;

  const style: any = {
      bottom: `${bottom}px`,
      height: !isExpandable
        ? customHeight
          ? `${customHeight}px`
          : "auto"
        : "",
      overflowY: isFullscreen || !isExpandable ? "scroll" : "hidden",
      overflowX: "hidden",
  };

  const preventDefaultAll = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`bottom-sheet__wrapper ${backdropClassName ? backdropClassName : null}`}
      onClick={closeBottomSheet}
      onTouchMove={preventDefaultAll}
      style={backdropStyle ? backdropStyle : null}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={containerStyle ? {...style, ...containerStyle} : style}
        onScroll={onScroll}
        className={`bottom-sheet__container ${containerClassName ? containerClassName : null} ${animationName}`}
        onTouchMove={onMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {React.Children.map(children, child => React.cloneElement(child, { closeBottomSheet }))}
      </div>
    </div>
  );
};

const INITIAL_BOTTOM_VALUE: number = -9000;

const BottomSheet = (props: BottomSheetProps) => {
  const {
    children,
    isExpandable,
    customHeight,
    onClose,
    backdropClassName,
    backdropStyle,
    containerClassName,
    containerStyle,
    animationDelay,
  } = props;

  // Get screen height and listen to resizes
  const heightHook: any = hookHeight();
  const [height, setHeight] = useState(0);

  // Save isScrolled value to prevent moving container while scrolling content
  const [isScrolled, setScrolled] = useState(false);

  const [isFullscreen, setFullscreen] = useState(false);

  // Store initial Y touch for calculations
  const [initTouchY, setInitTouchY] = useState(0);

  // Initial value from which will BottomSheet raise
  const [bottom, setBottom] = useState(INITIAL_BOTTOM_VALUE);

  // Store current bottom value
  const [bottomBase, setBottomBase] = useState(0);

  // Switch between different css animations
  const [animationName, setAnimationName] = useState("");

  const animationDelayValue: number = animationDelay
    ? animationDelay
    : DEFAULT_ANIMATION_DELAY;

  /**
   * Handle initial opening animation
   */
  useEffect(() => {
    // Set initial height
    setHeight(heightHook);

    let bottomInitial: number;

    // Trigger opening animation
    if (!isExpandable) {
      // Set base bottom value to show whole container
      bottomInitial = 0;

      setAnimationName('bottom-sheet__animate-open-modal');
    } else {
      // Show only half of the container
      bottomInitial = (heightHook / 2) * -1;

      setAnimationName('bottom-sheet__animate-open');
    }

    // Store initial values for further calculations
    setBottom(bottomInitial);
    setBottomBase(bottomInitial);
  }, []);

  /**
   * Prevent bottom sheet movement when children is scrolled or set initial
   * touch point on Y axis
   * @param e
   */
  const onTouchStart = (e: any): void => {
    // Prevent unwanted movement when children is scrolled
    if (isScrolled) {
      return;
    }

    // Set initial touch point for horizontal movement
    const touchEventY = e.nativeEvent.touches[0].clientY;
    setInitTouchY(touchEventY);
  };

  /**
   * Close bottom sheet or revert to basic position
   */
  const onTouchEnd = (): void => {
    // Prevent unwanted movement
    // when children is scrolled or for clicks
    if (isScrolled || bottom === bottomBase) {
      return;
    }

    if (!isExpandable) {
      const TRIGGER_NON_EXPANDABLE_RESET: number = (height / 3 / 10) * 3 * -1;
      if (bottom > 0) {
        // Moving up is disabled
        return;
      } else if (bottom > TRIGGER_NON_EXPANDABLE_RESET) {
        // Trigger reset to basic position
        setAnimationName("bottom-sheet__animate-reset-modal");
        setTimeout(() => {
          setBottom(0);
          setBottomBase(0);
          setAnimationName("");
        }, animationDelayValue);
      } else {
        // Close bottom sheet
        setAnimationName("bottom-sheet__animate-close");
        setTimeout(() => {
          setBottom(-height);
          setBottomBase(-height);
          closeBottomSheet();
        }, animationDelayValue);
      }
    }

    if (isExpandable) {
      const TRIGGER_EXPANDABLE_FULL_HEIGHT: boolean =
        bottom > (height / 2) * -1 && bottomBase !== 0;
      const TRIGGER_EXPANDABLE_RESET_TO_MIDDLE: boolean =
        bottom > (height / 10) * 7 * -1;
      const TRIGGER_EXPANDABLE_RESET_TO_FULL: boolean =
        bottom > (height / 3) * 2 * -1 && bottomBase !== (height / 2) * -1;

      // Expand bottom sheet to full height
      if (TRIGGER_EXPANDABLE_FULL_HEIGHT) {
        setAnimationName("bottom-sheet__animate-open-full");
        setTimeout(() => {
          setBottom(0);
          setAnimationName("");
          setFullscreen(true);
          setBottomBase(0);
        }, animationDelayValue);
      } else if (TRIGGER_EXPANDABLE_RESET_TO_MIDDLE || TRIGGER_EXPANDABLE_RESET_TO_FULL) {
        // Reset to middle
        setAnimationName("bottom-sheet__animate-reset");
        setTimeout(() => {
          setBottom((height / 2) * -1);
          setBottomBase((height / 2) * -1);
          setAnimationName("");
          setFullscreen(false);
        }, animationDelayValue);
      }  else {
        // Close bottom sheet
        setFullscreen(false);
        closeBottomSheet();
      }
    }
  };

  const closeBottomSheet = (e: any = undefined) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAnimationName("bottom-sheet__animate-close");

    setTimeout(() => {
      setBottom(-height);
      setBottomBase(-height);

      if (onClose) {
        onClose();
      }
    }, animationDelayValue);
  };

  const setNewBottom = (value: number) => {
    setBottom(value);
  };

  /**
   * Handle touch moves in container
   * @param e
   */
  const onMove = (e: any) => {
    if (isScrolled) {
      return;
    }
    e.preventDefault();

    // Adjust touch coordinates for natural movement
    const touchEventY: number = e.nativeEvent.touches[0].clientY;
    const differenceInTouch: number = initTouchY - touchEventY;

    // Set new bottom value
    const newBottomValue: number = bottomBase + differenceInTouch;

    // Prevent scrolling over bottom 0
    if (newBottomValue > 0) {
      return;
    }

    // Need different rules for up/down handling
    if (isFullscreen) {
      if (newBottomValue > bottomBase) {
        return;
      }
    }

    if (newBottomValue > bottom) {
      // Handle open to fullscreen
      if (!isExpandable) {
        return;
      }
    }

    setNewBottom(newBottomValue);
  };

  /**
   * Handle scrolling
   * @param e
   */
  const onScroll = (e: any) => {
    if (e.target.scrollTop > 0) {
      setScrolled(true);
      setFullscreen(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <BottomSheetView
      children={children}
      animationName={animationName}
      bottom={bottom}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMove={onMove}
      onClose={onClose}
      isFullscreen={isFullscreen}
      onScroll={onScroll}
      closeBottomSheet={closeBottomSheet}
      isExpandable={isExpandable}
      customHeight={customHeight}
      backdropClassName={backdropClassName}
      backdropStyle={backdropStyle}
      containerClassName={containerClassName}
      containerStyle={containerStyle}
    />
  );
};

export default BottomSheet;
