import { Link } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import{useEffect} from "react";
import { useToasts } from 'react-toast-notifications';


import classes from './_MainNavigation.module.scss';
import { authActions } from '../../store/auth-slice';


import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';


const MainNavigation = () => {
  const { addToast, removeAllToasts } = useToasts();


  const storeIsLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const storeError = useSelector(state => state.error.notification);

  useEffect(() => {
      if (storeError) {
        removeAllToasts();
        addToast(storeError.message, {appearance: 'error'  
         });
      }
  }, [storeError, addToast, removeAllToasts])

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(authActions.setLogout())
    console.log('logged_out');
  }

  
  return (
    <div>
    <header className={classes.header}>

            <Link to='/'>
              <div className={classes.logo}>Todo app</div>
            </Link>
          
      <div>
        <ul>
            {!storeIsLoggedIn && (
              <li>
              <Link to='/auth'>
              <AccountBoxIcon  sx={{ fontSize: 35 }} />
                {/* Login */}
              </Link>
              </li>
            )}            
          { storeIsLoggedIn && (
            <li>
            <button onClick={logoutHandler}>
            <ExitToAppIcon  sx={{ fontSize: 35 }} />
            </button>
            </li>
          )}
        </ul>
      </div>
    </header>
    {/* <ToastContainer /> */}
 
    </div>
  );
};

export default MainNavigation;
