interface BButtonProps {
  onClick?: () => void;
  text?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export const BButton: React.FC<BButtonProps> = ({
  onClick,
  text = '',
  icon: Icon,
  disabled = false,
  className,
  type = 'button',
  loading = false,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-sm fw-semibold px-3 d-flex align-items-center text-nowrap ${
        className || 'btn-primary text-white'
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span>
        {loading && <span className="spinner-border spinner-border-sm me-1 fs-6" />}
        {Icon && <Icon size={14} className="me-1" />}
        {text}
      </span>
    </button>
  );
};

export default BButton;
