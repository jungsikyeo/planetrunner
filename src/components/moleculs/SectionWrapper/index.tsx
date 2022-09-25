import React from 'react';
import { Title } from '@components/atoms';

export type Props = {
  title: string;
  children?: React.ReactNode | undefined;
  className?: string;
};

const SectionWrapper: React.FC<Props> = ({ title, children, className }) => {
  const generateIdSection = () =>
    `section-${title.replace(/\W/g, '-').toLowerCase()}`;
  return (
    <section
      className={className ? className : `mb-6`}
      id={generateIdSection()}
    >
      <Title type="title-section" text={title} />
      <div>{children}</div>
    </section>
  );
};

export default SectionWrapper;
