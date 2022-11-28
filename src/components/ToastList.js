import { forwardRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast, clearAllToast } from '../redux/features/toast/toastSlice';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ToastList = () => {
  const { toastList } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length) {
        dispatch(removeToast(0));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastList]);

  return (
    <Box sx={{ 
        width: '95%', 
        maxWidth: '400px', 
        zIndex: 99999, 
        position: 'fixed', 
        bottom: 12, 
        right: 12 
    }}>
      <Stack spacing={2}>
        {toastList.length > 2 && (
          <button style={{
                float: 'right', 
                border: 'none', 
                outline: 'none', 
                backgroundColor: 'transparent', 
                fontWeight: 'bold', 
                cursor: 'pointer'
          }}
            onClick={() => dispatch(clearAllToast())}
          >
            Clear All
          </button>
        )}
        {toastList.map((toast, index) => (
            <Alert key={index} severity={toast.type} sx={{ width: '100%' }}
                onClose={()=>dispatch(removeToast(index))}>
                {toast.message}
            </Alert>
        ))}
      </Stack>
    </Box>
  );
};

export default ToastList;