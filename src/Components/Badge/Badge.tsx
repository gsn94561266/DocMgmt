interface BadgeProps {
  label: string;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  const isCustomColor = color?.includes('#');
  const statusClassName = !isCustomColor && color ? `bg-${color}-subtle text-${color}` : '';
  const statusStyles = isCustomColor ? { backgroundColor: `${color}33`, color } : {};

  return (
    <span className={`badge px-2 fs-8 ${statusClassName}`} style={{ paddingTop: 6, paddingBottom: 6, ...statusStyles }}>
      {label}
    </span>
  );
};

export default Badge;
