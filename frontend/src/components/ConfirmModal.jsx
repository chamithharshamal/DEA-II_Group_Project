import { createPortal } from 'react-dom';

/**
 * ConfirmModal - A premium, reusable confirmation dialog.
 * 
 * @param {string} title - The heading of the modal.
 * @param {string} message - The descriptive text explaining the action.
 * @param {function} onConfirm - Callback when the primary button is clicked.
 * @param {function} onCancel - Callback when cancel or overlay is clicked.
 * @param {string} confirmText - Text for the primary action button.
 * @param {string} type - 'danger' | 'warning' | 'primary' (affects icon and button style).
 */
export default function ConfirmModal({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Delete', 
  type = 'danger' 
}) {
  const icon = type === 'danger' ? '🗑️' : type === 'warning' ? '⚠️' : '❓';

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: 'center', padding: '48px 32px 32px' }}>
          <div className="confirm-modal-icon">
            {icon}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            {message}
          </p>
        </div>
        <div className="modal-footer" style={{ background: 'var(--bg-card)' }}>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn btn-${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
