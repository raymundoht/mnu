import { Link } from 'react-router-dom';

const handleMouseEnter = () => {
  const cursor = document.getElementById('custom-cursor');
  if (cursor) cursor.classList.add('cursor-active');
};

const handleMouseLeave = () => {
  const cursor = document.getElementById('custom-cursor');
  if (cursor) cursor.classList.remove('cursor-active');
};

const CursorLink = ({ as, to, href, children, className = "", onClick, ...props }) => {
  if (to && !as) {
    return (
      <Link
        to={to}
        {...props}
        className={`${className} cursor-link`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => { if (onClick) onClick(e); }}
      >
        {children}
      </Link>
    );
  }

  const Tag = as || (href ? 'a' : 'button');

  return (
    <Tag
      {...(href ? { href } : {})}
      {...props}
      className={`${className} cursor-link`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => { if (onClick) onClick(e); }}
    >
      {children}
    </Tag>
  );
};

export default CursorLink;
