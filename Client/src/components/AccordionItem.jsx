import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export function AccordionItem({ title, children, icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('0px');

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight('0px');
        }
    }, [isOpen]);
    return (
        <div className="mb-2">
            <button
                className="w-full flex justify-between items-center text-black font-poppins rounded-lg text-left mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`flex  w-full items-center text-gray-900  dark:text-white group gap-3`}>
                <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {icon}
                </div>
                    <span>{title}</span>
                </div>

                <FiChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight }}
                className="transition-max-height duration-200 ease-in-out overflow-hidden"
            >
                <div className="normal-case">{children}</div>
            </div>
        </div>
    );
}
