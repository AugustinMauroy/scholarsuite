import classNames from 'classnames';
import type { FC, SVGProps } from 'react';

export const LogoLight: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1635_2)">
      <circle cx="22.5" cy="22.5" r="22.5" fill="#4F46E5" />
      <g filter="url(#filter0_i_1635_2)">
        <path
          d="M13 13H19C20.0609 13 21.0783 13.4214 21.8284 14.1716C22.5786 14.9217 23 15.9391 23 17V31C23 30.2044 22.6839 29.4413 22.1213 28.8787C21.5587 28.3161 20.7956 28 20 28H13V13Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33 13H27C25.9391 13 24.9217 13.4214 24.1716 14.1716C23.4214 14.9217 23 15.9391 23 17V31C23 30.2044 23.3161 29.4413 23.8787 28.8787C24.4413 28.3161 25.2044 28 26 28H33V13Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_i_1635_2"
        x="11"
        y="10"
        width="24.05"
        height="24.05"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="0.05" dy="0.05" />
        <feGaussianBlur stdDeviation="0.25" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_1635_2"
        />
      </filter>
      <clipPath id="clip0_1635_2">
        <rect width="45" height="45" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const LogoDark: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1635_11)">
      <circle cx="22.5" cy="22.5" r="22.5" fill="#818CF8" />
      <g filter="url(#filter0_i_1635_11)">
        <path
          d="M13 13H19C20.0609 13 21.0783 13.4214 21.8284 14.1716C22.5786 14.9217 23 15.9391 23 17V31C23 30.2044 22.6839 29.4413 22.1213 28.8787C21.5587 28.3161 20.7956 28 20 28H13V13Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33 13H27C25.9391 13 24.9217 13.4214 24.1716 14.1716C23.4214 14.9217 23 15.9391 23 17V31C23 30.2044 23.3161 29.4413 23.8787 28.8787C24.4413 28.3161 25.2044 28 26 28H33V13Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_i_1635_11"
        x="11"
        y="10"
        width="24.05"
        height="24.05"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="0.05" dy="0.05" />
        <feGaussianBlur stdDeviation="0.25" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_1635_11"
        />
      </filter>
      <clipPath id="clip0_1635_11">
        <rect width="45" height="45" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

type LogoProps = {
  className?: string;
};

const Logo: FC<LogoProps> = ({ className }) => (
  <>
    <LogoLight className={classNames('block dark:hidden', className)} />
    <LogoDark className={classNames('hidden dark:block', className)} />
  </>
);

export default Logo;
