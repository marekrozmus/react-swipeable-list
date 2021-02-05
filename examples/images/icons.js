import React from 'react';

const Svg = props => (
  <svg
    height="100%"
    viewBox="0 0 24 24"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);

export const DeleteIcon = () => (
  <Svg>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
  </Svg>
);

export const MailIcon = () => (
  <Svg>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 4.99L4 6h16zm0 12H4V8l8 5 8-5v10z" />
  </Svg>
);

export const ReplyIcon = () => (
  <Svg>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
  </Svg>
);
