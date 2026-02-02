import React from "react";

interface HighlightedTextProps {
    text: string;
    query: string;
}

export const HighlightedText = ({ text, query }: HighlightedTextProps) => {
    if (!query.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark
                        key={i}
                        className="bg-primary/20 text-primary rounded-sm px-0.5 font-medium"
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};
