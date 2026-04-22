import React from 'react'

type StepsProps = {
    step: 0 | 1 | 2 | 3
}

const Steps = ({ step }: StepsProps) => {
    const getStepClassName = (index: 1 | 2 | 3) =>
        step === index ? 'bg-g-3/80' : 'bg-[#2E2D28]'

    return (
        <div className="mb-7 flex items-center justify-between">
            <div className="flex gap-2">
                <span className={`h-[2px] w-7 rounded-full ${getStepClassName(1)}`} />
                <span className={`h-[2px] w-7 rounded-full ${getStepClassName(2)}`} />
                <span className={`h-[2px] w-7 rounded-full ${getStepClassName(3)}`} />
            </div>
        </div>
    )
}

export default Steps