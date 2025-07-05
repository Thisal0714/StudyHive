import React, { SVGProps } from "react";

export interface RightArrowIconProps extends SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
}

const RightArrowIcon = ({
  width = 24,
  height = 24,
  ...props
}: RightArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="m18.72 6.78l-1.44 1.44L24.063 15H4v2h20.063l-6.782 6.78l1.44 1.44l8.5-8.5l.686-.72l-.687-.72l-8.5-8.5z"
      />
    </svg>
  );
};

export default RightArrowIcon;
