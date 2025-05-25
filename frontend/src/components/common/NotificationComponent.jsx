// src/components/common/Notification.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { hideNotification } from '../../redux/slices/notificationSlice';
import { IoClose, IoCheckmarkCircle, IoInformationCircle, IoWarning } from 'react-icons/io5';

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type, isVisible } = useSelector((state) => state.notification);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000); // 5 seconds
    }
    return () => clearTimeout(timer);
  }, [isVisible, dispatch]);

  const handleClose = () => {
    dispatch(hideNotification());
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-[#2C2C2C] border-l-4 border-[#4CAF50] text-white';
      case 'error':
        return 'bg-[#2C2C2C] border-l-4 border-[#FF3B30] text-white';
      case 'notice':
        return 'bg-[#2C2C2C] border-l-4 border-[#0A84FF] text-white';
      default:
        return 'bg-[#2C2C2C] border-l-4 border-white text-white';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-5 h-5 text-[#4CAF50] mr-3" />;
      case 'error':
        return <IoWarning className="w-5 h-5 text-[#FF3B30] mr-3" />;
      case 'notice':
        return <IoInformationCircle className="w-5 h-5 text-[#0A84FF] mr-3" />;
      default:
        return null;
    }
  };



  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-[9999] flex items-center min-w-[320px] p-4 rounded-md shadow-lg ${getNotificationStyles(type)}`}
        >
          {getIcon(type)}
          <span className="flex-grow">{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <IoClose size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;