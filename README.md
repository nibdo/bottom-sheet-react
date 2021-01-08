# bottom-sheet-react

Simple expandable Bottom Sheet for React

## Install 

    npm i bottom-sheet-react

## How to use

Add your single ChildrenComponent inside BottomSheet. 

    import BottomSheet from 'bottom-sheet-react';

    <BottomSheet
        isExpandable={true}
        customHeight={200}
        onClose={customCloseHandler}>
        <ChildrenComponent/>
    </BottomSheet>

## Methods for children
Call function closeBottomSheet from children if you want to access closing trigger.

## Props

prop      | type             | default          |  desc      
----------|-------------|--------------|--------
`isExpandable`   | `boolean`  |false | expand to full height
`customHeight`| `number` |  | adjust container height
`onClose`    | `function`   |  | callback for closing
`animationDelay` | `number` | 250ms | delay before closing
`backdropClassName` | `string` |  | class style for backdrop
`backdropStyle`   | `object`   |  | object style for backdrop
`containerClassName` | `string` | | class style for container
`containerStyle` | `object` | | object style for container
