import { cloneElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { ActiveLinkProps } from './types';

const ActiveLink: FC<ActiveLinkProps> = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter();

  const className = asPath === props.href
    ? activeClassName
    : '';

  return (
    <Link {...props}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};

export default ActiveLink;
