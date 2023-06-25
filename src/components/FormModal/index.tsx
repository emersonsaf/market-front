import { Modal } from "@mui/material";
import { Box } from "@mui/system";

interface FormModalProps {
  isModalOpen: boolean,
  size?: number,
  onClose: (params: any) => any,
  children: JSX.Element
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#F5F5F5',
  border: '1px solid #CCC',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
  borderRadius: 5,
  padding: '20px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  fontFamily: 'Arial, sans-serif',
  transition: 'opacity 0.3s ease-in-out',
}

export function FormModal({isModalOpen, onClose, children, size = 200} : FormModalProps) {
  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: size }}>
          {children}
        </Box>
      </Modal>
    </>
  )
}