// frontend/src/pages/user/components/SeatSelectionModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function SeatSelectionModal({
  onClose,
  onSeatSelected,
  occupiedSeats = [],
  vipRows = [4, 5]
}) {
  const rows = 10;
  const cols = 15;

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariant = {
    hidden: { scale: 0.8, opacity: 0, y: -50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 15 }
    }
  };

  const handleSeatClick = (row, col) => {
    const seatId = `${row}-${col}`;
    // Jeśli miejsce jest zajęte – blokujemy
    if (occupiedSeats.includes(seatId)) return;

    const isVip = vipRows.includes(row);
    onSeatSelected({ seatId, isVip });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="backdrop"
        variants={backdropVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999
        }}
      >
        <motion.div
          className="modalContent"
          variants={modalVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '80%',
            backgroundColor: '#222',
            borderRadius: 8,
            overflow: 'auto',
            padding: '16px',
            color: '#fff'
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
            Wybierz miejsce
          </Typography>

          {/* Ekran */}
          <Box
            sx={{
              width: '70%',
              height: '25px',
              backgroundColor: '#555',
              color: '#fff',
              textAlign: 'center',
              margin: '0 auto',
              mb: 2,
              borderRadius: '4px'
            }}
          >
            Ekran
          </Box>

          {/* Miejsca */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const row = rowIndex + 1;
              return (
                <Box
                  key={`row-${row}`}
                  sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                >
                  {/* Etykieta rzędu (np. "Rząd 1 (VIP)") */}
                  <Typography sx={{ width: 80, textAlign: 'right', mr: 2 }}>
                    Rząd {row} {vipRows.includes(row) ? '(VIP)' : ''}
                  </Typography>

                  {Array.from({ length: cols }).map((__, colIndex) => {
                    const col = colIndex + 1;
                    const seatId = `${row}-${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isVip = vipRows.includes(row);

                    let bgColor = '#666'; // wolne - standard
                    if (isOccupied) bgColor = '#d32f2f'; // czerwony = zajęte
                    else if (isVip) bgColor = '#ffb74d'; // VIP

                    // Tekst tooltipa
                    const seatInfo = `Rząd ${row}, Miejsce ${col}${
                      isVip ? ' (VIP)' : ''
                    } – ${isOccupied ? 'Zajęte' : 'Wolne'}`;

                    return (
                      <Tooltip key={seatId} title={seatInfo} arrow>
                        <motion.div
                          onClick={() => handleSeatClick(row, col)}
                          style={{
                            width: 24,
                            height: 24,
                            margin: 3,
                            borderRadius: 4,
                            cursor: isOccupied ? 'not-allowed' : 'pointer',
                            backgroundColor: bgColor
                          }}
                          whileHover={{
                            scale: isOccupied ? 1 : 1.2
                          }}
                          whileTap={{
                            scale: isOccupied ? 1 : 0.9
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SeatSelectionModal;
